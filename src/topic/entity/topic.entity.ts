import { Chat } from 'src/chat/chat.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TopicReserve } from './topic-reservation.entity';
import { TopicUsers } from './topic-users.entity';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  topicId: number;

  @Column()
  topicName: string;

  @Column({ nullable: true })
  topicStartDate: Date;

  @Column({ nullable: true })
  topicEndDate: Date;

  @OneToMany(() => Chat, (chat) => chat.chatId)
  chat: Chat[];

  @OneToMany(() => TopicUsers, (topicUsers) => topicUsers.infoId)
  topicUsers: TopicUsers[];

  @OneToMany(() => TopicReserve, (topicReserve) => topicReserve.reserveId)
  topicReserve: TopicReserve[];

  setTopic(_topicName: string) {
    this.topicName = _topicName;
  }
}
