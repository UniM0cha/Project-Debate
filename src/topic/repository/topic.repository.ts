import { EntityRepository, Repository } from 'typeorm';
import { Topic } from '../entity/topic.entity';

@EntityRepository(Topic)
export class TopicRepository extends Repository<Topic> {}
