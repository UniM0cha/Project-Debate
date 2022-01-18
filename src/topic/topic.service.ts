import { Injectable, Logger } from '@nestjs/common';
import { Users } from 'src/users/users.entity';
import { UsersRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { OpinionType, TopicUsers } from './entity/topic-users.entity';
import { TopicUsersRepository } from './repository/topic-users.repository';
import { Topic } from './entity/topic.entity';
import { TopicRepository } from './repository/topic.repository';
import { Cron } from '@nestjs/schedule';
import { TopicReserveRepository } from './repository/topic-reserve.repository';
import { ReserveType, TopicReserve } from './entity/topic-reservation.entity';
import { throws } from 'assert';
import { TopicDto } from 'src/admin/dto/topic.dto';
import { ReserveDto } from 'src/admin/dto/reserve.dto';

@Injectable()
export class TopicService {
  // if (beforeTopic) {
  //   await this.topicRepository.update(beforeTopic, {
  //     topicActivate: false,
  //     topicEndDate: today,
  //   });
  // }
  // cycled를 true로

  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly usersService: UsersService,
    private readonly topicUsersRepository: TopicUsersRepository,
    private readonly topicReserveRepository: TopicReserveRepository,
  ) {}
  private readonly logger = new Logger(TopicService.name);

  async findAllTopics(): Promise<Topic[]> {
    return this.topicRepository.find();
  }

  async findOneTopic(id: number): Promise<Topic> {
    return await this.topicRepository.findOne(id);
  }

  async findAllTopicReserves(): Promise<TopicReserve[]> {
    return this.topicReserveRepository.find({ relations: ['topic'] });
  }

  async findOneTopicReserve(id: number): Promise<TopicReserve> {
    return await this.topicReserveRepository.findOne(id, {
      relations: ['topic'],
    });
  }

  /*
  @Cron('0 * * * * *')
  async cycleTopic() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.logger.debug(`Today: ${today}`);

    // 오늘에 해당하는 cycle을 가져와서
    const todayCycle: TopicCycle = await this.topicCycleRepository.findOne({
      cycleDate: today,
    });
    this.logger.debug(`Today Cycle: ${JSON.stringify(todayCycle, null, 4)}`);

    // cycle이 있다면
    if (todayCycle) {
      // 그 cycle이 발동되지 않았다면
      if (!todayCycle.cycled) {
        // 주제 활성화 - 주제 테이블에 activate true, 생성시간 기록
        const topic = todayCycle.topic;

        await this.topicRepository.update(topic, {
          topicActivate: true,
          topicStartDate: today,
        });

        // 이전 주제는 비활성화 - 주제 테이블에 actovate false, 종료시간 기록
        // const beforeTopic = await this.topicRepository.findOne({
        //   topicId: topicId - 1,
        // });
        // this.logger.debug(
        //   `beforTopic: ${JSON.stringify(beforeTopic, null, 4)}`,
        // );

        // if (beforeTopic) {
        //   await this.topicRepository.update(beforeTopic, {
        //     topicActivate: false,
        //     topicEndDate: today,
        //   });
        // }

        // cycled를 true로
        await this.topicCycleRepository.update(todayCycle, { cycled: true });
      }
    }
  }
  */

  async createTopic(topic: TopicDto): Promise<Topic> {
    const newTopic = new Topic();
    newTopic.setTopic(topic.topicName);
    const createdTopic = await this.topicRepository.save(newTopic);
    return createdTopic;
  }

  async updateTopic(id: number, topic: TopicDto): Promise<any> {
    return await this.topicRepository.update(
      { topicId: id },
      { topicName: topic.topicName },
    );
  }

  async deleteTopic(id: number): Promise<any> {
    return await this.topicRepository.delete(id);
  }

  async createReserve(reserve: ReserveDto): Promise<TopicReserve> {
    const topic: Topic = await this.topicRepository.findOne(reserve.topicId);

    const newReserve = new TopicReserve();
    const date = new Date(reserve.reserveDate);
    newReserve.setReserve(date, topic);

    const createdReserve = await this.topicReserveRepository.save(newReserve);
    return createdReserve;
  }

  async updateReserve(id: number, reserve: ReserveDto): Promise<any> {
    const topic: Topic = await this.topicRepository.findOne(reserve.topicId);
    return await this.topicReserveRepository.update(
      { reserveId: id },
      { reserveDate: reserve.reserveDate, topic: topic },
    );
  }

  async deleteReserve(id: number) {
    return await this.topicReserveRepository.delete(id);
  }

  async checkParticipant(_userId: string): Promise<OpinionType | null> {
    const user: Users = await this.usersService.findOne(_userId);
    const topic: Topic = await this.topicRepository.findActivateTopic();

    const topicUsers: TopicUsers = await this.topicUsersRepository.findOne({
      users: user,
      topic: topic,
    });

    if (topicUsers) {
      return topicUsers.opinionType;
    } else {
      return null;
    }
  }

  async updateOpinion(type: OpinionType) {}

  async addTestData() {
    const topic1 = new Topic();
    topic1.topicName = 'topic1';

    const topic2 = new Topic();
    topic2.topicName = 'topic2';

    const topic3 = new Topic();
    topic3.topicName = 'topic3';

    await this.topicRepository.save([topic1, topic2, topic3]);

    const topicReserve1 = new TopicReserve();
    const date1 = new Date('2022-02-04');
    topicReserve1.reserveDate = date1;
    topicReserve1.topic = topic1;
    topicReserve1.reserveState = ReserveType.PENDING;

    const topicReserve2 = new TopicReserve();
    const date2 = new Date('2022-02-05');
    topicReserve2.reserveDate = date2;
    topicReserve2.topic = topic2;
    topicReserve2.reserveState = ReserveType.PENDING;

    await this.topicReserveRepository.save([topicReserve1, topicReserve2]);
  }
}
