import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Topic } from './topic.entity';

export enum ReserveType {
  PENDING = 'pending',
  PROCEEDING = 'proceeding',
  PASSED = 'passed',
}

@Entity()
export class TopicReserve {
  @PrimaryGeneratedColumn()
  reserveId: number;

  @Column()
  reserveDate: Date;

  @Column()
  reserveState: ReserveType;

  @ManyToOne(() => Topic, (topic) => topic.topicId)
  topic: Topic;
}
