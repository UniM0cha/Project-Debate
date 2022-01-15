import { Controller } from '@nestjs/common';
import { Users } from 'src/users/users.entity';
import { OpinionType } from './topic-users.entity';
import { TopicUsersRepository } from './topic-users.repository';
import { Topic } from './topic.entity';
import { TopicRepository } from './topic.repository';

@Controller('topic')
export class TopicController {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly topicUsersRepository: TopicUsersRepository,
  ) {}

  async createNewTopic(topic: Topic): Promise<Topic> {
    const createdTopic = await this.topicRepository.save(topic);
    return createdTopic;
  }

  async updateOpinion(type: OpinionType) {}

  async deleteTopic(topicId: number) {}

  async checkParticipant(
    userId: string,
    topicId: number,
  ): Promise<OpinionType> {
    const topic = new Topic();
    const users = new Users();
    this.topicUsersRepository.find({ users: users, topic: topic });

    return OpinionType.DISAGREE;
    return OpinionType.AGREE;
  }
}
