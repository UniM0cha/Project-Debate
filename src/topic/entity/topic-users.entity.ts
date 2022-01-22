import { Users } from 'src/users/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TopicReserve } from './topic-reservation.entity';

export enum OpinionType {
  AGREE = 'agree',
  DISAGREE = 'disagree',
}

@Entity()
export class TopicUsers {
  @PrimaryGeneratedColumn()
  topicUsersId: number;

  @Column({ type: 'enum', enum: OpinionType })
  opinionType: OpinionType;

  @ManyToOne(() => Users, (users) => users.userId)
  users: Users;

  @ManyToOne(() => TopicReserve, (topicReserve) => topicReserve.reserveId)
  topicReserve: TopicReserve;

  setTopicUsers(
    opinionType: OpinionType,
    users: Users,
    topicReserve: TopicReserve,
  ) {
    this.opinionType = opinionType;
    this.users = users;
    this.topicReserve = topicReserve;
  }
}
