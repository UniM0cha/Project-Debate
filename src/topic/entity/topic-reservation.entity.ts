import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ default: ReserveType.PENDING })
  reserveState: ReserveType;

  @ManyToOne(() => Topic, (topic) => topic.topicId)
  topic: Topic;

  setReserve(_reserveDate: Date, _topic: Topic) {
    this.reserveDate = _reserveDate;
    this.topic = _topic;
  }
}
