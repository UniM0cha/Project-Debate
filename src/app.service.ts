import { Injectable, Logger } from '@nestjs/common';
import { stringify } from 'querystring';
import { ViewDto, ViewOpinionDto, ViewTopicDto } from './dto/view.dto';
import { TopicReserve } from './topic/entity/topic-reservation.entity';
import { OpinionType } from './topic/entity/topic-users.entity';
import { Topic } from './topic/entity/topic.entity';
import { TopicService } from './topic/topic.service';

@Injectable()
export class AppService {
  constructor(private topicService: TopicService) {}
  private readonly logger = new Logger(AppService.name);

  async createViewDto(session: Record<string, any>): Promise<ViewDto> {
    session.save();
    let isLogined: boolean = session.isLogined;
    let nickname: string = null;
    let userId: string = null;

    let topic: ViewTopicDto = new ViewTopicDto();

    let hasOpinion: boolean = null;
    let opinion: ViewOpinionDto = new ViewOpinionDto();

    // 로그인 체크
    if (session.isLogined) {
      isLogined = true;
      nickname = session.userData.nickname;
      userId = session.userData.userId;

      // 사용자의 의견 받아오기
      let userOpinion: OpinionType = await this.topicService.getOpinion(userId);
      hasOpinion = userOpinion ? true : false;
      opinion.setViewOpinionType(userOpinion);
    } else {
      isLogined = false;
      nickname = null;
      userId = null;
      hasOpinion = false;
    }

    // 주제 체크
    let currentReserve: TopicReserve =
      await this.topicService.findCurrentReserve();
    let nextReserve: TopicReserve = await this.topicService.findNextReserve();

    let currentTopicName = currentReserve
      ? currentReserve.topic.topicName
      : null;
    let afterTopicName = nextReserve ? nextReserve.topic.topicName : null;
    let endDate = nextReserve ? nextReserve.reserveDate : null;

    let agree: number = await this.topicService.getAgree(currentReserve);
    let disagree: number = await this.topicService.getDisagree(currentReserve);

    topic.setViewTopicDto(currentTopicName, afterTopicName, endDate);
    opinion.setViewOpinionNumber(agree, disagree);

    return new ViewDto(isLogined, nickname, userId, topic, hasOpinion, opinion);
  }

  async getCurrentReserveId(): Promise<number> {
    const currentReserve: TopicReserve =
      await this.topicService.findCurrentReserve();
    return currentReserve ? currentReserve.reserveId : null;
  }
}
