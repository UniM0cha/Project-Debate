import { Injectable, Logger } from '@nestjs/common';
import { Users } from 'src/users/users.entity';
import { UsersRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { OpinionType, TopicUsers } from './topic-users.entity';
import { TopicUsersRepository } from './topic-users.repository';
import { Topic } from './topic.entity';
import { TopicRepository } from './topic.repository';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly usersService: UsersService,
    private readonly topicUsersRepository: TopicUsersRepository,
  ) {}
  private readonly logger = new Logger(TopicService.name);

  async checkParticipant(_userId: string): Promise<OpinionType | null> {
    const user: Users = await this.usersService.findOne(_userId);
    const topic: Topic = await this.topicRepository.findActivateTopic();

    const topicUsers: TopicUsers = await this.topicUsersRepository.findOne({
      users: user,
      topic: topic,
    });

    if (topicUsers) {
      return topicUsers.opinionType;
    } else {
      return null;
    }
  }
}
