import { Injectable, Logger } from '@nestjs/common';
import { TopicService } from 'src/topic/topic.service';

@Injectable()
export class ListService {
  constructor(private readonly topicService: TopicService) {}
  private readonly logger = new Logger(ListService.name);
}
