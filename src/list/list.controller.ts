import { Controller, Get, Render, Res, Session } from '@nestjs/common';
import session from 'express-session';
import { ViewDto } from 'src/dto/view.dto';
import { TopicReserve } from 'src/topic/entity/topic-reservation.entity';
import { Topic } from 'src/topic/entity/topic.entity';
import { TopicService } from 'src/topic/topic.service';
import { ReserveDto } from '../admin/dto/reserve.dto';
import { TopicDto } from '../admin/dto/topic.dto';

@Controller('list')
export class ListController {
  constructor(private readonly topicServices: TopicService) {}
  @Get('/')
  @Render('ex_debate_list')
  async getAllTopics(@Res() res) {
    //await this.topicServices.addTestData();
    const topicReserves: TopicReserve[] =
      await this.topicServices.findAllTopicReservesWithTopic();
    const topics: Topic[] = await this.topicServices.findAllTopics();
    //return res.render('ex_debate_list', { topics: topics });
    return res.render('ex_debate_list', {
      topicReserves: topicReserves,
      topics: topics,
    });
  }
  list(@Session() session: Record<string, any>) {
    // let sessionDto = new ViewDto(session);
    // return sessionDto;
  }
}
