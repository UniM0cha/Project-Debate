import { Injectable, Logger } from '@nestjs/common';
import { TopicReserve } from 'src/topic/entity/topic-reservation.entity';
import { TopicService } from 'src/topic/topic.service';
import { ViewTopicDto } from '../dto/view.dto';

@Injectable()
export class ListService {
  constructor(private readonly topicService: TopicService) {}
  private readonly logger = new Logger(ListService.name);

  async setTopicDto(reserveId: number): Promise<ViewTopicDto> {
    let viewTopic: ViewTopicDto = new ViewTopicDto();
    const topicReserve: TopicReserve =
      await this.topicService.findOneTopicReserveWithTopic(reserveId);
    const currentReserveId: number = topicReserve.reserveId;
    const currentTopicName: string = topicReserve.topic.topicName;
    viewTopic.setViewTopicDto(currentReserveId, currentTopicName, null, null);
    return viewTopic;
  }
}
