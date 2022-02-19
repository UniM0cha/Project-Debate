import { Injectable, Logger } from '@nestjs/common';
import { stringify } from 'querystring';
import { ViewDto, ViewTopicDto } from './dto/view.dto';
import { TopicReserve } from './topic/entity/topic-reservation.entity';
import { OpinionType } from './topic/entity/topic-users.entity';
import { Topic } from './topic/entity/topic.entity';
import { TopicService } from './topic/topic.service';

@Injectable()
export class AppService {
  constructor(private topicService: TopicService) {}
  private readonly logger = new Logger(AppService.name);
}
