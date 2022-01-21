import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TopicUsers } from './topic-users.entity';
import { Topic } from './topic.entity';

export enum ReserveType {
  PENDING = 'pending',
  PROCEEDING = 'proceeding',
  PASSED = 'passed',
}

@Entity()
export class TopicReserve {
  @PrimaryGeneratedColumn()
  reserveId: number;

  @Column()
  reserveDate: Date;

  @Column({ default: ReserveType.PENDING })
  reserveState: ReserveType;

  @ManyToOne(() => Topic, (topic) => topic.topicId)
  topic: Topic;

  @OneToMany(() => TopicUsers, (topicUsers) => topicUsers.topicUsersId)
  topicUsers: TopicUsers[];

  setReserve(_reserveDate: Date, _topic: Topic) {
    this.reserveDate = _reserveDate;
    this.topic = _topic;
  }
}
