import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TopicReserve } from './topic-reservation.entity';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  topicId: number;

  @Column()
  topicName: string;

  // @OneToMany(() => Chat, (chat) => chat.chatId)
  // chat: Chat[];

  // @OneToMany(() => TopicUsers, (topicUsers) => topicUsers.infoId)
  // topicUsers: TopicUsers[];

  @OneToMany(() => TopicReserve, (topicReserve) => topicReserve.reserveId)
  topicReserve: TopicReserve[];

  setTopic(_topicName: string) {
    this.topicName = _topicName;
  }
}
