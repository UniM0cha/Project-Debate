import { OpinionType } from 'src/topic/topic-users.entity';

export class ViewDto {
  constructor(
    isLogind: boolean,
    nickname: string,
    userId: string,
    isParticipant: boolean,
    opinion: OpinionType,
  ) {
    this.isLogined = isLogind;
    this.nickname = nickname;
    this.userId = userId;
    this.isParticipant = isParticipant;
    this.opinion = opinion;
  }

  readonly isLogined: boolean;
  readonly nickname: string;
  readonly userId: string;
  readonly isParticipant: boolean;
  readonly opinion: OpinionType;
  readonly topic: {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
  };
}
