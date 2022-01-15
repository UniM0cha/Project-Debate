import { Chat } from 'src/chat/chat.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TopicUsers } from './topic-users.entity';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  topicId: number;

  @Column()
  topicName: string;

  @Column()
  topicCreateDate: Date;

  @Column()
  topicEndDate: Date;

  @Column()
  opinionAgree: number;

  @Column()
  opinionDisagree: number;

  @Column()
  topicActivate: boolean;

  @OneToMany(() => Chat, (chat) => chat.chatId)
  chat: Chat[];

  @OneToMany(() => TopicUsers, (topicUsers) => topicUsers.infoId)
  topicUsers: TopicUsers[];
}
