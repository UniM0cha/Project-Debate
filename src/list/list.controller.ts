import { Controller, Get, Param, Render, Res, Session } from '@nestjs/common';
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
  async getAllTopics(@Res() res) {
    await this.topicServices.addTestData();
    const topicReserves: TopicReserve[] =
      await this.topicServices.findAllTopicReservesWithTopic();
    const topics: Topic[] = await this.topicServices.findAllTopics();
    const topicReserveCount: Number = await this.topicServices.getPassedCount();
    const topicReservePageCount: Number = Math.floor(
      ((await this.topicServices.getPassedCount()) - 1) / 10 + 1,
    );
    console.log('최대값 : ' + topicReserveCount);
    console.log('페이지 수 : ' + topicReservePageCount);
    const getEndTime: TopicReserve[] = await this.topicServices.getPassedList();
    const getEndTimeList: Date[] = getEndTime.map((getEndTime) => {
      getEndTime.reserveDate.setDate(getEndTime.reserveDate.getDate() - 1);
      return getEndTime.reserveDate;
    });
    getEndTimeList.reverse();
    console.log(getEndTimeList);
    console.log(topicReserves);

    //return res.render('ex_debate_list', { topics: topics });
    return res.render('ex_debate_list', {
      topicReserves: topicReserves,
      topics: topics,
      topicReserveCount: topicReserveCount,
      topicReservePageCount: topicReservePageCount,
    });
  }
  list(@Session() session: Record<string, any>) {
    // let sessionDto = new ViewDto(session);
    // return sessionDto;
  }
}
