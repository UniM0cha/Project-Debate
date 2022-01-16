import { EntityRepository, Repository } from 'typeorm';
import { TopicUsers } from '../entity/topic-users.entity';

@EntityRepository(TopicUsers)
export class TopicUsersRepository extends Repository<TopicUsers> {}
