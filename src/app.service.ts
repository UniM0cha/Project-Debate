import { Injectable, Logger } from '@nestjs/common';
import { TopicService } from './topic/topic.service';

@Injectable()
export class AppService {
  constructor(private topicService: TopicService) {}
  private readonly logger = new Logger(AppService.name);
}
