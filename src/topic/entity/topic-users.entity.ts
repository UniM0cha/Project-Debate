import { Users } from 'src/users/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Topic } from './topic.entity';

export enum OpinionType {
  AGREE = 'agree',
  DISAGREE = 'disagree',
}

@Entity()
export class TopicUsers {
  @PrimaryGeneratedColumn()
  infoId: number;

  @Column({ type: 'enum', enum: OpinionType })
  opinionType: OpinionType;

  @ManyToOne(() => Users, (users) => users.userId)
  users: Users;

  @ManyToOne(() => Topic, (topic) => topic.topicId)
  topic: Topic;
}
