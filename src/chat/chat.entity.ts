import { Topic } from 'src/topic/entity/topic.entity';
import { Users } from 'src/users/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  chatId: number;

  @Column()
  chatDate: Date;

  @Column({ type: 'text' })
  chatMessage: string;

  @ManyToOne(() => Users, (user) => user.userId)
  user: Users;

  @ManyToOne(() => Topic, (topic) => topic.topicId)
  topic: Topic;

  createChat(data: any, user: Users) {
    this.user = user;
    this.chatDate = data.date;
    this.chatMessage = data.opinion_input;
  }
}
