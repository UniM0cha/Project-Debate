import { OpinionType } from 'src/topic/entity/topic-users.entity';

export class ViewDto {
  readonly isLogined: boolean;
  readonly nickname: string;
  readonly userId: string;
  readonly topic: ViewTopicDto;
  readonly hasOpinion: boolean;
  readonly opinion: ViewOpinionDto;

  constructor(
    _isLogined: boolean,
    _nickname: string,
    _userId: string,
    _topic: ViewTopicDto,
    _hasOpinion: boolean,
    _opinion: ViewOpinionDto,
  ) {
    this.isLogined = _isLogined;
    this.nickname = _nickname;
    this.userId = _userId;
    this.topic = _topic;
    this.hasOpinion = _hasOpinion;
    this.opinion = _opinion;
  }
}

export class ViewTopicDto {
  private currentTopicName: string;
  private afterTopicName: string;
  private endDate: Date;

  setViewTopicDto(
    _currentTopicName: string,
    _afterTopicName: string,
    _endDate: Date,
  ) {
    this.currentTopicName = _currentTopicName;
    this.afterTopicName = _afterTopicName;
    this.endDate = _endDate;
  }
}

export class ViewOpinionDto {
  private type: OpinionType;
  private agree: number;
  private disagree: number;

  setViewOpinionType(_type: OpinionType) {
    this.type = _type;
  }

  setViewOpinionNumber(_agree: number, _disagree: number) {
    this.agree = _agree;
    this.disagree = _disagree;
  }
}
