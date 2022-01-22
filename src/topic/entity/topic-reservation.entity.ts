import { Chat } from 'src/chat/chat.entity';
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

  @Column({ type: 'enum', enum: ReserveType, default: ReserveType.PENDING })
  reserveState: ReserveType;

  @ManyToOne(() => Topic, (topic) => topic.topicId)
  topic: Topic;

  @OneToMany(() => TopicUsers, (topicUsers) => topicUsers.topicUsersId)
  topicUsers: TopicUsers[];

  @OneToMany(() => Chat, (chat) => chat.chatId)
  chat: Chat[];

  setReserve(_reserveDate: Date, _topic: Topic) {
    this.reserveDate = _reserveDate;
    this.topic = _topic;
  }
}
