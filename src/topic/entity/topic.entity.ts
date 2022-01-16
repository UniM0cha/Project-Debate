import { Chat } from 'src/chat/chat.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column()
  topicActivate: boolean;

  @OneToMany(() => Chat, (chat) => chat.chatId)
  chat: Chat[];

  @OneToMany(() => TopicUsers, (topicUsers) => topicUsers.infoId)
  topicUsers: TopicUsers[];

  setTopic(topic: string, start: Date) {
    this.topicName = topic;
    this.topicStartDate = start;
  }
}
