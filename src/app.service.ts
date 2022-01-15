import { Injectable } from '@nestjs/common';
import { ViewDto } from './dto/view.dto';
import { OpinionType } from './topic/topic-users.entity';
import { Topic } from './topic/topic.entity';
import { TopicService } from './topic/topic.service';

@Injectable()
export class AppService {
  constructor(private topicService: TopicService) {}

  async createViewDto(session: Record<string, any>): Promise<ViewDto> {
    let _isLogined: boolean = session.isLogind;
    let _nickname: string,
      _userId: string,
      _isParticipant: boolean,
      _opinion: OpinionType;

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

    const viewDto = new ViewDto(
      _isLogined,
      _nickname,
      _userId,
      _isParticipant,
      _opinion,
    );
    return viewDto;
  }
}
