import { OpinionType } from 'src/topic/entity/topic-users.entity';

export class ViewDto {
  isLogined: boolean;
  nickname: string;
  userId: string;
  topic?: ViewTopicDto;
  hasOpinion?: boolean;

  constructor(_isLogined: boolean, _nickname: string, _userId: string) {
    this.isLogined = _isLogined;
    this.nickname = _nickname;
    this.userId = _userId;
  }
}

export class ViewTopicDto {
  private currentReserveId: number;
  private currentTopicName: string;
  private afterTopicName: string;
  private endDate: Date;

  setViewTopicDto(
    _currentReserveId: number,
    _currentTopicName: string,
    _afterTopicName: string,
    _endDate: Date,
  ) {
    this.currentReserveId = _currentReserveId;
    this.currentTopicName = _currentTopicName;
    this.afterTopicName = _afterTopicName;
    this.endDate = _endDate;
  }
}
