import { TopicReserve } from 'src/topic/entity/topic-reservation.entity';
import { OpinionType } from 'src/topic/entity/topic-users.entity';
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

  @Column({ type: 'enum', enum: OpinionType })
  opinionType: OpinionType;

  @ManyToOne(() => Users, (user) => user.userId)
  user: Users;

  @ManyToOne(() => TopicReserve, (topicReserve) => topicReserve.reserveId)
  topicReserve: TopicReserve;

  createChat(
    date: Date,
    message: string,
    user: Users,
    topicReserve: TopicReserve,
  ) {
    this.user = user;
    this.chatDate = date;
    this.chatMessage = message;
    this.topicReserve = topicReserve;
  }
}
