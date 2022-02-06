import { Logger } from '@nestjs/common';
import { EntityRepository, MoreThan, Repository } from 'typeorm';
import { ReserveType, TopicReserve } from '../entity/topic-reservation.entity';

@EntityRepository(TopicReserve)
export class TopicReserveRepository extends Repository<TopicReserve> {
  private readonly logger = new Logger(TopicReserveRepository.name);
}
