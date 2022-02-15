import { Injectable, Logger } from '@nestjs/common';
import { TopicReserve } from 'src/topic/entity/topic-reservation.entity';
import { TopicService } from 'src/topic/topic.service';
import { ViewTopicDto } from '../dto/view.dto';

@Injectable()
export class ListService {
  constructor(private readonly topicService: TopicService) {}
  private readonly logger = new Logger(ListService.name);
}
