import { Chat } from 'src/chat/chat.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  kakaoId: string;

  @Column({ nullable: true })
  naverId: string;

  @Column({ nullable: true })
  googleId: string;

  @OneToMany(() => Chat, (chat) => chat.chatId)
  chat: Chat[];
}
