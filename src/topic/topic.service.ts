import { Injectable, Logger } from '@nestjs/common';
import { Users } from 'src/users/users.entity';
import { UsersRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { OpinionType, TopicUsers } from './entity/topic-users.entity';
import { TopicUsersRepository } from './repository/topic-users.repository';
import { Topic } from './entity/topic.entity';
import { TopicRepository } from './repository/topic.repository';
import { Cron } from '@nestjs/schedule';
import { TopicCycleRepository } from './repository/topic-cycle.repository';
import { TopicCycle } from './entity/topic-cycle.entity';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly usersService: UsersService,
    private readonly topicUsersRepository: TopicUsersRepository,
    private readonly topicCycleRepository: TopicCycleRepository,
  ) {}
  private readonly logger = new Logger(TopicService.name);

  @Cron('* * * * * *')
  async cycleTopic() {
    this.logger.debug('hello');
    const today = new Date();
    // 오늘에 해당하는 cycle을 가져와서
    const todayCycle: TopicCycle = await this.topicCycleRepository.findOne({
      cycleDate: today,
    });
    if (todayCycle) {
      // 그 cycle이 이미 발동되었다면
      // 무시하고
      // 아니라면
      // 순환을 시킨다
    }
  }

  async createNewTopic(topic: string, start: Date): Promise<Topic> {
    let newTopic = new Topic();
    newTopic.setTopic(topic, start);

    const createdTopic = await this.topicRepository.save(newTopic);

    return createdTopic;
  }

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

  async updateOpinion(type: OpinionType) {}

  async deleteTopic(topicId: number) {}
}
