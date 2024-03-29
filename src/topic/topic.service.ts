import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Users } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { OpinionType, TopicUsers } from './entity/topic-users.entity';
import { TopicUsersRepository } from './repository/topic-users.repository';
import { Topic } from './entity/topic.entity';
import { TopicRepository } from './repository/topic.repository';
import { Cron } from '@nestjs/schedule';
import { TopicReserveRepository } from './repository/topic-reserve.repository';
import { ReserveType, TopicReserve } from './entity/topic-reservation.entity';
import { AdminTopicDto } from 'src/admin/dto/admin.topic.dto';
import { AdminReserveDto } from 'src/admin/dto/reserve.dto';
import { MoreThan } from 'typeorm';
import { TopicDto } from './dto/topic.dto';

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
  @Cron('0 0 0 * * *')
  async cycleTopic() {
    this.logger.debug(`Start Cycling....`);

    // 오늘 교체되야야하는 주제
    const korToday = new Date();
    korToday.setHours(0, 0, 0, 0);
    this.logger.debug(`Find Today Reserve - Today is: ${korToday}`);

    const todayReserve: TopicReserve =
      await this.topicReserveRepository.findOne({
        startDate: korToday,
        reserveState: ReserveType.PENDING,
      });

    if (!todayReserve) {
      this.logger.debug('오늘 교체되기로 한 주제가 없습니다.');
      return;
    }
    this.logger.debug(
      `오늘 교체되어야 할 주제: ${JSON.stringify(todayReserve, null, 4)}`,
    );

    // 오늘 교체되어야 하는 주제의 상태를 PENDING으로
    if (todayReserve.reserveState === ReserveType.PENDING) {
      this.topicReserveRepository.update(
        { reserveId: todayReserve.reserveId },
        { reserveState: ReserveType.PROCEEDING },
      );
    }

    // 먼저 진행중이었던 주제
    const currentReserve: TopicReserve = await this.findCurrentReserve();
    if (!currentReserve) {
      this.logger.debug('현재 진행중인 주제가 없습니다.');
      return;
    }
    this.logger.debug(
      `현재 진행중인 주제: ${JSON.stringify(currentReserve, null, 4)}`,
    );

    // 먼저 진행중이었던 주제는 PASSED로 변경하고 어제를 종료 날짜로 기록
    if (currentReserve.reserveState === ReserveType.PROCEEDING) {
      const yesterday = new Date(korToday);
      yesterday.setDate(korToday.getDate() - 1);

      this.topicReserveRepository.update(
        { reserveId: currentReserve.reserveId },
        {
          reserveState: ReserveType.PASSED,
          endDate: yesterday,
        },
      );
    }
  }

  async findNextReserve(): Promise<TopicReserve> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.topicReserveRepository.findOne({
      where: { startDate: MoreThan(today) },
      relations: ['topic'],
      order: { startDate: 'ASC' },
    });
  }

  async findCurrentReserve(): Promise<TopicReserve> {
    return await this.topicReserveRepository.findOne(
      {
        reserveState: ReserveType.PROCEEDING,
      },
      { relations: ['topic'] },
    );
  }

  async findAllTopics(): Promise<Topic[]> {
    return await this.topicRepository.find();
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

  async createTopic(topic: AdminTopicDto): Promise<Topic> {
    const newTopic = new Topic();
    newTopic.setTopic(topic.topicName);
    const createdTopic = await this.topicRepository.save(newTopic);
    return createdTopic;
  }

  async updateTopic(id: number, topic: AdminTopicDto): Promise<any> {
    return await this.topicRepository.update(
      { topicId: id },
      { topicName: topic.topicName },
    );
  }

  async deleteTopic(id: number): Promise<any> {
    return await this.topicRepository.delete(id);
  }

  async createReserve(reserve: AdminReserveDto): Promise<TopicReserve> {
    const topic: Topic = await this.topicRepository.findOne(reserve.topicId);

    const newReserve = new TopicReserve();
    const korDate = new Date(reserve.reserveDate);
    korDate.setHours(korDate.getHours() - 9);
    newReserve.setReserve(korDate, topic);

    const createdReserve = await this.topicReserveRepository.save(newReserve);
    return createdReserve;
  }

  async updateReserve(id: number, reserve: AdminReserveDto): Promise<any> {
    const topic: Topic = await this.topicRepository.findOne(reserve.topicId);

    const korDate = new Date(reserve.reserveDate);
    korDate.setHours(korDate.getHours() - 9);

    return await this.topicReserveRepository.update(
      { reserveId: id },
      { startDate: korDate, topic: topic },
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
    const topicReserve: TopicReserve = await this.findCurrentReserve();
    // const user: Users = await this.usersService.findOneById(_userId);
    // const topicUsers: TopicUsers = await this.topicUsersRepository.findOne({
    //   users: user,
    //   topicReserve: topicReserve,
    // });

    const topicUsers: TopicUsers = await this.topicUsersRepository.findOne({
      select: ['opinionType'],
      where: { users: { userId: _userId }, topicReserve: topicReserve },
    });
    return topicUsers ? topicUsers.opinionType : null;
  }

  async addAgreeDisagree(userId: string, reserveId: number, type: OpinionType) {
    // userId와 reserveId 검증
    if (!userId) {
      this.logger.error(`addAgreeDisagree failed: 등록된 유저가 없습니다.`);
      throw new BadRequestException();
    }

    if (!reserveId) {
      this.logger.error(
        `addAgreeDisagree failed: 유효하지 않은 주제예약 번호입니다.`,
      );
      throw new BadRequestException();
    }

    // 현재 진행중인 주제인지 검증
    const currentReserve: TopicReserve = await this.findCurrentReserve();

    if (currentReserve.reserveId === reserveId) {
      this.logger.error(
        `addAgreeDisagree failed: 현재 진행중인 주제가 아닙니다.`,
      );
      throw new BadRequestException();
    }

    // 유효한 userId인지 검증
    const user: Users = await this.usersService.findOneById(userId);
    if (!user) {
      this.logger.error(`addAgreeDisagree failed: 존재하지 않는 유저입니다.`);
      throw new BadRequestException();
    }

    // 존재하는 주제 예약 번호인지 검증
    const topicReserve: TopicReserve =
      await this.topicReserveRepository.findOne(reserveId);
    if (!topicReserve) {
      this.logger.error(
        `addAgreeDisagree failed: 존재하지 않는 주제예약 번호입니다.`,
      );
      throw new BadRequestException();
    }

    // 이미 의견을 표출한 유저인지 검증
    const topicUser: TopicUsers = await this.topicUsersRepository.findOne({
      users: user,
      topicReserve: topicReserve,
    });

    if (topicUser) {
      this.logger.error(
        `addAgreeDisagree failed: 이미 의견을 결정한 유저입니다.`,
      );
      throw new BadRequestException();
    }

    const newTopicUser = new TopicUsers();
    newTopicUser.setTopicUsers(type, user, topicReserve);
    await this.topicUsersRepository.save(newTopicUser);
    this.logger.debug(`addAgreeDisagree Success`);
    return;
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
    if (!user) {
      this.logger.error(`유저 의견 저장 실패: 존재하지 않는 유저입니다.`);
      return 1;
    }

    const reserve = await this.topicReserveRepository.findOne(reserveId);
    if (!reserve) {
      this.logger.error(`유저 의견 저장 실패: 유효하지 않은 주제입니다.`);
      return 2;
    }

    const hasOpinionType = await this.findUserOpinionType(user, reserve);
    if (hasOpinionType) {
      this.logger.error(`유저 의견 저장 실패: 이미 의견을 설정한 유저입니다.`);
      return 3;
    }

    const newOpinion = new TopicUsers();
    newOpinion.setTopicUsers(opinionType, user, reserve);
    await this.topicUsersRepository.save(newOpinion);
    this.logger.debug(`유저 의견 저장 성공`);
    return 0;
  }

  async getPassedCount(): Promise<number> {
    const passedCount: number = await this.topicReserveRepository.count({
      reserveState: ReserveType.PASSED,
    });
    return passedCount;
  }

  async getPassedList(): Promise<TopicReserve[]> {
    const passedList: TopicReserve[] = await this.topicReserveRepository.find({
      select: ['startDate'],
      where: { reserveState: ReserveType.PASSED },
    });
    return passedList;
  }
  async findOnePassedTopicReserve(reserveId: number): Promise<TopicReserve> {
    return this.topicReserveRepository.findOne({
      reserveId: reserveId,
      reserveState: ReserveType.PASSED,
    });
  }

  async findOneProceedingTopicReserve(
    reserveId: number,
  ): Promise<TopicReserve> {
    return this.topicReserveRepository.findOne({
      reserveId: reserveId,
      reserveState: ReserveType.PROCEEDING,
    });
  }

  async findPASSEDTopicReservesWithTopic(): Promise<TopicReserve[]> {
    return this.topicReserveRepository.find({
      relations: ['topic'],
      order: { reserveId: 'DESC' },
      where: { reserveState: ReserveType.PASSED },
    });
  }

  async setTopicDataDto(): Promise<TopicDto> {
    let topic: TopicDto = new TopicDto();

    let currentReserve: TopicReserve = await this.findCurrentReserve();
    let nextReserve: TopicReserve = await this.findNextReserve();

    let currentReserveId = currentReserve ? currentReserve.reserveId : null;
    let currentTopicName = currentReserve
      ? currentReserve.topic.topicName
      : null;
    let afterTopicName = nextReserve ? nextReserve.topic.topicName : null;
    let endDate = nextReserve ? nextReserve.startDate : null;

    topic.setTopicDto(
      currentReserveId,
      currentTopicName,
      afterTopicName,
      endDate,
    );
    return topic;
  }

  async setListTopicDto(reserveId: number): Promise<TopicDto> {
    let topicDto: TopicDto = new TopicDto();
    const topicReserve: TopicReserve = await this.findOneTopicReserveWithTopic(
      reserveId,
    );
    const currentReserveId: number = topicReserve.reserveId;
    const currentTopicName: string = topicReserve.topic.topicName;
    topicDto.setTopicDto(currentReserveId, currentTopicName, null, null);
    return topicDto;
  }

  async checkHasOpinion(userId: string): Promise<boolean> {
    if (!userId) return false;
    const userOpinion: OpinionType = await this.getOpinion(userId);
    const hasOpinion: boolean = userOpinion ? true : false;
    return hasOpinion;
  }

  async getCurrentReserveId(): Promise<number> {
    const currentReserve: TopicReserve = await this.findCurrentReserve();
    return currentReserve ? currentReserve.reserveId : null;
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
    topicReserve1.startDate = date1;
    topicReserve1.topic = topic1;
    topicReserve1.reserveState = ReserveType.PENDING;

    const topicReserve2 = new TopicReserve();
    const date2 = new Date('2022-01-18');
    topicReserve2.startDate = date2;
    topicReserve2.topic = topic2;
    topicReserve2.reserveState = ReserveType.PASSED;

    const topicReserve3 = new TopicReserve();
    const date3 = new Date('2022-01-19');
    topicReserve3.startDate = date3;
    topicReserve3.topic = topic3;
    topicReserve3.reserveState = ReserveType.PASSED;

    const topicReserve4 = new TopicReserve();
    const date4 = new Date('2022-01-20');
    topicReserve4.startDate = date4;
    topicReserve4.topic = topic1;
    topicReserve4.reserveState = ReserveType.PASSED;

    const topicReserve5 = new TopicReserve();
    const date5 = new Date('2022-01-21');
    topicReserve5.startDate = date5;
    topicReserve5.topic = topic2;
    topicReserve5.reserveState = ReserveType.PASSED;

    const topicReserve6 = new TopicReserve();
    const date6 = new Date('2022-01-22');
    topicReserve6.startDate = date6;
    topicReserve6.topic = topic3;
    topicReserve6.reserveState = ReserveType.PASSED;

    const topicReserve7 = new TopicReserve();
    const date7 = new Date('2022-01-23');
    topicReserve7.startDate = date7;
    topicReserve7.topic = topic3;
    topicReserve7.reserveState = ReserveType.PASSED;

    const topicReserve8 = new TopicReserve();
    const date8 = new Date('2022-01-24');
    topicReserve8.startDate = date8;
    topicReserve8.topic = topic3;
    topicReserve8.reserveState = ReserveType.PASSED;

    const topicReserve9 = new TopicReserve();
    const date9 = new Date('2022-01-25');
    topicReserve9.startDate = date9;
    topicReserve9.topic = topic3;
    topicReserve9.reserveState = ReserveType.PASSED;

    const topicReserve10 = new TopicReserve();
    const date10 = new Date('2022-01-26');
    topicReserve10.startDate = date10;
    topicReserve10.topic = topic3;
    topicReserve10.reserveState = ReserveType.PASSED;

    const topicReserve11 = new TopicReserve();
    const date11 = new Date('2022-01-27');
    topicReserve11.startDate = date11;
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
