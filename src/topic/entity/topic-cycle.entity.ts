import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TopicCycle {
  @PrimaryGeneratedColumn()
  cycleId: number;

  @Column()
  cycleDate: Date;

  @Column()
  cycled: boolean;

  @Column()
  topicId: number;
}
