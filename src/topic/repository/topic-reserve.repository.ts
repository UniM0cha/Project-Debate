import { EntityRepository, Repository } from 'typeorm';
import { TopicReserve } from '../entity/topic-reservation.entity';

@EntityRepository(TopicReserve)
export class TopicReserveRepository extends Repository<TopicReserve> {}
