import { Injectable, Logger } from '@nestjs/common';
import { Users } from 'src/users/users.entity';
import { UsersRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { OpinionType, TopicUsers } from './entity/topic-users.entity';
import { TopicUsersRepository } from './repository/topic-users.repository';
import { Topic } from './entity/topic.entity';
import { TopicRepository } from './repository/topic.repository';
import { Cron } from '@nestjs/schedule';
import { TopicCycleRepository } from './repository/topic-cycle.repository';
import { TopicCycle } from './entity/topic-cycle.entity';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly usersService: UsersService,
    private readonly topicUsersRepository: TopicUsersRepository,
    private readonly topicCycleRepository: TopicCycleRepository,
  ) {}
  private readonly logger = new Logger(TopicService.name);

  @Cron('0 * * * * *')
  async cycleTopic() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.logger.debug(`Today: ${today}`);

    // const addCycle = new TopicCycle();
    // addCycle.cycleDate = today;
    // addCycle.cycled = false;
    // addCycle.topicId = 1;
    // await this.topicCycleRepository.save(addCycle);

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
        const topicId = todayCycle.topicId;

        await this.topicRepository.update(
          { topicId: topicId },
          { topicActivate: true, topicStartDate: today },
        );

        // 이전 주제는 비활성화 - 주제 테이블에 actovate false, 종료시간 기록
        const beforeTopic = await this.topicRepository.findOne({
          topicId: topicId - 1,
        });
        this.logger.debug(
          `beforTopic: ${JSON.stringify(beforeTopic, null, 4)}`,
        );

        if (beforeTopic) {
          await this.topicRepository.update(beforeTopic, {
            topicActivate: false,
            topicEndDate: today,
          });
        }

        // cycled를 true로
        await this.topicCycleRepository.update(todayCycle, { cycled: true });
      }
    }
  }

  async createNewTopic(topic: string, start: Date): Promise<Topic> {
    let newTopic = new Topic();
    newTopic.setTopic(topic, start);

    const createdTopic = await this.topicRepository.save(newTopic);

    return createdTopic;
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

  async deleteTopic(topicId: number) {}
}
