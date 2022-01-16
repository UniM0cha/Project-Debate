import { Chat } from 'src/chat/chat.entity';
import { TopicUsers } from 'src/topic/entity/topic-users.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @Column({ nullable: true })
  kakaoId: string;

  @Column({ nullable: true })
  naverId: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  registerDate: Date;

  @OneToMany(() => Chat, (chat) => chat.chatId)
  chat: Chat[];

  @OneToMany(() => TopicUsers, (topicUsers) => topicUsers.infoId)
  topicUsers: TopicUsers[];
}
