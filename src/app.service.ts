import { Injectable, Logger } from '@nestjs/common';
import { ViewDto } from './dto/view.dto';
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
    let _isLogined: boolean = session.isLogined,
      _nickname: string = null,
      _userId: string = null,
      _isParticipant: boolean = null,
      _opinion: OpinionType = null,
      _currentTopicName: string = null,
      _afterTopicName: string = null,
      _endDate: Date = null;

    // 로그인 체크
    if (session.isLogined) {
      _isLogined = true;
      _nickname = session.userData.nickname;
      _userId = session.userData.userId;

      _opinion = await this.topicService.checkParticipant(_userId);
      _isParticipant = _opinion ? true : false;
    } else {
      _isLogined = false;
      _nickname = null;
      _userId = null;
      _isParticipant = false;
    }

    // 주제 체크
    let currentReserve: TopicReserve =
      await this.topicService.findCurrentReserve();
    let afterReserve: TopicReserve = await this.topicService.findAfterReserve();

    _currentTopicName = currentReserve ? currentReserve.topic.topicName : null;
    _afterTopicName = afterReserve ? afterReserve.topic.topicName : null;
    _endDate = afterReserve ? afterReserve.reserveDate : null;

    return new ViewDto(
      _isLogined,
      _nickname,
      _userId,
      _isParticipant,
      _opinion,
      _currentTopicName,
      _afterTopicName,
      _endDate,
    );
  }
}
