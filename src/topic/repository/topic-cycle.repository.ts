import { EntityRepository, Repository } from 'typeorm';
import { TopicCycle } from '../entity/topic-cycle.entity';

@EntityRepository(TopicCycle)
export class TopicCycleRepository extends Repository<TopicCycle> {}
