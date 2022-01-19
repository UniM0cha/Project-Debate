import { OpinionType } from 'src/topic/entity/topic-users.entity';

export class ViewDto {
  readonly isLogined: boolean;
  readonly nickname: string;
  readonly userId: string;
  readonly isParticipant: boolean;
  readonly opinion: OpinionType;
  readonly topic: {
    currentTopicName: string;
    afterTopicName: string;
    endDate: Date;
  };

  constructor(
    _isLogined: boolean,
    _nickname: string,
    _userId: string,
    _isParticipant: boolean,
    _opinion: OpinionType,
    _currentTopicName: string,
    _afterTopicName: string,
    _endDate: Date,
  ) {
    this.isLogined = _isLogined;
    this.nickname = _nickname;
    this.userId = _userId;
    this.isParticipant = _isParticipant;
    this.opinion = _opinion;
    this.topic = {
      currentTopicName: _currentTopicName,
      afterTopicName: _afterTopicName,
      endDate: _endDate,
    };
  }
}
