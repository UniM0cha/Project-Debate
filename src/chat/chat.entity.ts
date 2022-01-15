import { Users } from 'src/users/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  chatId: number;

  @ManyToOne(() => Users, (user) => user.userId)
  user: Users;

  @Column()
  chatDate: Date;

  @Column({ type: 'text' })
  chatMessage: string;

  createChat(data: any, user: Users) {
    this.user = user;
    this.chatDate = data.date;
    this.chatMessage = data.opinion_input;
  }
}
