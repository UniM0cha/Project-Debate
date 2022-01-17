import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import { Topic } from './entity/topic.entity';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}
  private readonly logger = new Logger(TopicController.name);
}
