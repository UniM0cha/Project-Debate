import { Injectable, Logger } from '@nestjs/common';
import { Users } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { OpinionType, TopicUsers } from './entity/topic-users.entity';
import { TopicUsersRepository } from './repository/topic-users.repository';
import { Topic } from './entity/topic.entity';
import { TopicRepository } from './repository/topic.repository';
import { Cron } from '@nestjs/schedule';
import { TopicReserveRepository } from './repository/topic-reserve.repository';
import { ReserveType, TopicReserve } from './entity/topic-reservation.entity';
import { TopicDto } from 'src/admin/dto/topic.dto';
import { ReserveDto } from 'src/admin/dto/reserve.dto';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly usersService: UsersService,
    private readonly topicUsersRepository: TopicUsersRepository,
    private readonly topicReserveRepository: TopicReserveRepository,
  ) {}
  private readonly logger = new Logger(TopicService.name);

  /** 주제 순환 코드 */
  @Cron('0 0 * * * *')
  async cycleTopic() {
    this.logger.debug(`Start Cycling....`);

    // 현재 진행중인 주제
    const currentReserve: TopicReserve =
      await this.topicReserveRepository.findCurrentReserve();

    // 오늘 교체되야야하는 주제
    const todayReserve: TopicReserve =
      await this.topicReserveRepository.findTodayTopicReserve();

    this.logger.debug(
      `Current Reserve: ${JSON.stringify(currentReserve, null, 4)}`,
    );
    this.logger.debug(
      `Today Reserve: ${JSON.stringify(todayReserve, null, 4)}`,
    );

    // 오늘 교체되기로 한 주제가 있음
    if (todayReserve) {
      // 교체되기로 한 것은 PROCCEING으로 변경
      if (todayReserve.reserveState === ReserveType.PENDING) {
        this.topicReserveRepository.updateToProceeding(todayReserve.reserveId);
      }

      // 진행중인 예약이 있는지 확인 -> 예약된것이 없는 초기상태를 대비
      if (currentReserve) {
        // 먼저 진행되었던 것은 PASSED로 변경
        if (currentReserve.reserveState === ReserveType.PROCEEDING) {
          this.topicReserveRepository.updateToPassed(currentReserve.reserveId);
        }
      }
    }
  }

  async findNextReserve(): Promise<TopicReserve> {
    return await this.topicReserveRepository.findNextReserve();
  }

  async findCurrentReserve(): Promise<TopicReserve> {
    return await this.topicReserveRepository.findCurrentReserve();
  }

  async findAllTopics(): Promise<Topic[]> {
    return this.topicRepository.find();
  }

  async findOneTopic(id: number): Promise<Topic> {
    return await this.topicRepository.findOne(id);
  }

  async findAllTopicReservesWithTopic(): Promise<TopicReserve[]> {
    return this.topicReserveRepository.find({
      relations: ['topic'],
      order: { reserveId: 'DESC' },
    });
  }

  async findOneTopicReserveWithTopic(id: number): Promise<TopicReserve> {
    return await this.topicReserveRepository.findOne(id, {
      relations: ['topic'],
    });
  }

  async findOneTopicReserve(id: number): Promise<TopicReserve> {
    return await this.topicReserveRepository.findOne(id);
  }

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

  /**
   * userId를 받아오고 현재 진행중인 주제를 가져와서
   * 해당 유저가 어떤 의견인지 반환한다.
   */
  async getOpinion(_userId: string): Promise<OpinionType> {
    const user: Users = await this.usersService.findOneById(_userId);
    const topicReserve: TopicReserve =
      await this.topicReserveRepository.findCurrentReserve();
    const topicUsers: TopicUsers = await this.topicUsersRepository.findOne({
      users: user,
      topicReserve: topicReserve,
    });
    return topicUsers ? topicUsers.opinionType : null;
  }

  async addAgree(userId: string, reserveId: number) {
    const user: Users = await this.usersService.findOneById(userId);
    const topicReserve: TopicReserve =
      await this.topicReserveRepository.findOne(reserveId);

    let topicUser: TopicUsers = await this.topicUsersRepository.findOne({
      users: user,
      topicReserve: topicReserve,
    });

    // 이미 의견 표출 했다면 Update, 새로운 의견이면 save
    if (topicUser) {
      await this.topicUsersRepository.update(topicUser, {
        opinionType: OpinionType.AGREE,
      });
      this.logger.debug(`Agree Opinion Update Success`);
    } else {
      topicUser = new TopicUsers();
      topicUser.users = user;
      topicUser.topicReserve = topicReserve;
      topicUser.opinionType = OpinionType.AGREE;
      await this.topicUsersRepository.save(topicUser);
      this.logger.debug(`Agree Opinion Save Success`);
    }
  }

  async addDisagree(userId: string, reserveId: number) {
    const user: Users = await this.usersService.findOneById(userId);
    const topicReserve: TopicReserve =
      await this.topicReserveRepository.findOne(reserveId);

    let topicUser: TopicUsers = await this.topicUsersRepository.findOne({
      users: user,
      topicReserve: topicReserve,
    });

    // 이미 의견 표출 했다면 Update, 새로운 의견이면 save
    if (topicUser) {
      await this.topicUsersRepository.update(topicUser, {
        opinionType: OpinionType.DISAGREE,
      });
      this.logger.debug(`Disagree Opinion Update Success`);
    } else {
      topicUser = new TopicUsers();
      topicUser.users = user;
      topicUser.topicReserve = topicReserve;
      topicUser.opinionType = OpinionType.DISAGREE;
      await this.topicUsersRepository.save(topicUser);
      this.logger.debug(`Disagree Opinion Save Success`);
    }
  }

  async getAgree(currentReserve: TopicReserve): Promise<number> {
    const agree: number = await this.topicUsersRepository.count({
      topicReserve: currentReserve,
      opinionType: OpinionType.AGREE,
    });
    return agree;
  }

  async getDisagree(currentReserve: TopicReserve): Promise<number> {
    const agree: number = await this.topicUsersRepository.count({
      topicReserve: currentReserve,
      opinionType: OpinionType.DISAGREE,
    });
    return agree;
  }

  async findUserOpinionType(
    user: Users,
    reserve: TopicReserve,
  ): Promise<OpinionType> {
    const topicUser: TopicUsers = await this.topicUsersRepository.findOne({
      users: user,
      topicReserve: reserve,
    });
    return topicUser ? topicUser.opinionType : null;
  }

  async getAgreeDisagree(reserveId: number): Promise<any> {
    const topicReserve: TopicReserve =
      await this.topicReserveRepository.findOne(reserveId);

    if (topicReserve) {
      const agree: number = await this.topicUsersRepository.count({
        topicReserve: topicReserve,
        opinionType: OpinionType.AGREE,
      });
      const disagree: number = await this.topicUsersRepository.count({
        topicReserve: topicReserve,
        opinionType: OpinionType.DISAGREE,
      });
      this.logger.debug(
        `찬성/반대 값 가져오기 성공: agree = ${agree}, disagree = ${disagree}`,
      );
      return { agree: agree, disagree: disagree };
    } else {
      this.logger.error(
        '찬성/반대 값 가져오기 실패: 주제가 존재하지 않습니다.',
      );
      return null;
    }
  }

  async validateAndSaveOpinionType(data: any): Promise<number> {
    /**상태코드
     * 0 : 저장 성공
     * 1 : 존재하지 않는 유저
     * 2 : 유효하지 않는 주제
     * 3 : 이미 의견을 설정한 유저
     */

    const userId: string = data.userId;
    const reserveId: number = data.reserveId;
    const opinionType: OpinionType = data.opinionType;

    const user = await this.usersService.findOneById(userId);
    if (user) {
      const reserve = await this.topicReserveRepository.findOne(reserveId);
      if (reserve) {
        const hasOpinionType = await this.findUserOpinionType(user, reserve);
        if (!hasOpinionType) {
          const newOpinion = new TopicUsers();
          newOpinion.setTopicUsers(opinionType, user, reserve);
          await this.topicUsersRepository.save(newOpinion);
          this.logger.debug(`유저 의견 저장 성공`);
          return 0;
        } else {
          this.logger.error(
            `유저 의견 저장 실패: 이미 의견을 설정한 유저입니다.`,
          );
          return 3;
        }
      } else {
        this.logger.error(`유저 의견 저장 실패: 유효하지 않은 주제입니다.`);
        return 2;
      }
    } else {
      this.logger.error(`유저 의견 저장 실패: 존재하지 않는 유저입니다.`);
      return 1;
    }
  }

  async getPassedCount(): Promise<number> {
    const passedCount: number = await this.topicReserveRepository.count({
      reserveState: ReserveType.PASSED,
    });
    return passedCount;
  }

  async findOnePassedTopicReserve(reserveId: number): Promise<TopicReserve> {
    return this.topicReserveRepository.findOne({
      reserveId: reserveId,
      reserveState: ReserveType.PASSED,
    });
  }

  async addTestData() {
    const topic1 = new Topic();
    topic1.topicName = 'Topic1';

    const topic2 = new Topic();
    topic2.topicName = 'Topic2';

    const topic3 = new Topic();
    topic3.topicName = 'Topic3';

    await this.topicRepository.save([topic1, topic2, topic3]);

    const topicReserve1 = new TopicReserve();
    const date1 = new Date('2022-01-01');
    topicReserve1.reserveDate = date1;
    topicReserve1.topic = topic1;
    topicReserve1.reserveState = ReserveType.PASSED;

    const topicReserve2 = new TopicReserve();
    const date2 = new Date('2022-01-18');
    topicReserve2.reserveDate = date2;
    topicReserve2.topic = topic2;
    topicReserve2.reserveState = ReserveType.PASSED;

    const topicReserve3 = new TopicReserve();
    const date3 = new Date('2022-01-19');
    topicReserve3.reserveDate = date3;
    topicReserve3.topic = topic3;
    topicReserve3.reserveState = ReserveType.PASSED;

    const topicReserve4 = new TopicReserve();
    const date4 = new Date('2022-01-20');
    topicReserve4.reserveDate = date4;
    topicReserve4.topic = topic1;
    topicReserve4.reserveState = ReserveType.PASSED;

    const topicReserve5 = new TopicReserve();
    const date5 = new Date('2022-01-21');
    topicReserve5.reserveDate = date5;
    topicReserve5.topic = topic2;
    topicReserve5.reserveState = ReserveType.PASSED;

    const topicReserve6 = new TopicReserve();
    const date6 = new Date('2022-01-22');
    topicReserve6.reserveDate = date6;
    topicReserve6.topic = topic3;
    topicReserve6.reserveState = ReserveType.PASSED;

    const topicReserve7 = new TopicReserve();
    const date7 = new Date('2022-01-23');
    topicReserve7.reserveDate = date7;
    topicReserve7.topic = topic3;
    topicReserve7.reserveState = ReserveType.PASSED;

    const topicReserve8 = new TopicReserve();
    const date8 = new Date('2022-01-24');
    topicReserve8.reserveDate = date8;
    topicReserve8.topic = topic3;
    topicReserve8.reserveState = ReserveType.PASSED;

    const topicReserve9 = new TopicReserve();
    const date9 = new Date('2022-01-25');
    topicReserve9.reserveDate = date9;
    topicReserve9.topic = topic3;
    topicReserve9.reserveState = ReserveType.PASSED;

    const topicReserve10 = new TopicReserve();
    const date10 = new Date('2022-01-26');
    topicReserve10.reserveDate = date10;
    topicReserve10.topic = topic3;
    topicReserve10.reserveState = ReserveType.PASSED;

    const topicReserve11 = new TopicReserve();
    const date11 = new Date('2022-01-27');
    topicReserve11.reserveDate = date11;
    topicReserve11.topic = topic3;
    topicReserve11.reserveState = ReserveType.PASSED;

    await this.topicReserveRepository.save([
      topicReserve1,
      topicReserve2,
      topicReserve3,
      topicReserve4,
      topicReserve5,
      topicReserve6,
      topicReserve7,
      topicReserve8,
      topicReserve9,
      topicReserve10,
      topicReserve11,
    ]);
  }
}
