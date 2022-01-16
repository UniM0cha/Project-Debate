import { EntityRepository, Repository } from 'typeorm';
import { Topic } from '../entity/topic.entity';

@EntityRepository(Topic)
export class TopicRepository extends Repository<Topic> {
  async findActivateTopic(): Promise<Topic> {
    return await this.findOne({ topicActivate: true });
  }
}
