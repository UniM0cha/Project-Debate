import {
  Controller,
  Get,
  Render,
  Res,
  Session,
  Param,
  Logger,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ChatService } from 'src/chat/chat.service';
import { TopicReserve } from 'src/topic/entity/topic-reservation.entity';
import { Topic } from 'src/topic/entity/topic.entity';
import { TopicService } from 'src/topic/topic.service';
import { ListService } from './list.service';

@Controller('list')
export class ListController {
  constructor(
    private readonly topicServices: TopicService,
    private readonly chatService: ChatService,
    private readonly appService: AppService,
    private readonly listService: ListService,
  ) {}
  private readonly logger = new Logger(ListController.name);

  @Get('/')
  async getAllTopics(@Res() res, @Session() session) {
    // await this.topicServices.addTestData();
    // const topicReserves: TopicReserve[] =
    //   await this.topicServices.findAllTopicReservesWithTopic();
    const topics: Topic[] = await this.topicServices.findAllTopics();
    const getPassedTopicList: TopicReserve[] =
      await this.topicServices.findPASSEDTopicReservesWithTopic();
    const topicReserveCount: Number = await this.topicServices.getPassedCount();
    const topicReservePageCount: Number = Math.floor(
      ((await this.topicServices.getPassedCount()) - 1) / 10 + 1,
    );
    console.log('최대값 : ' + topicReserveCount);
    console.log('페이지 수 : ' + topicReservePageCount);

    const getEndTime: TopicReserve[] = await this.topicServices.getPassedList();
    const getEndTimeList: TopicReserve[] = getEndTime.map((getEndTime) => {
      getEndTime.reserveDate.setDate(getEndTime.reserveDate.getDate() - 1);
      return getEndTime;
    });
    getEndTimeList.reverse();
    console.log(getPassedTopicList);
    let arr1 = [];
    for( let i: number = 1; i <= topicReservePageCount; i++ ) {
      if(topicReserveCount.valueOf() / i >= 10) {
        arr1.push( getPassedTopicList.slice( (i - 1) * 10, i * 10 ) );
      } else {
        arr1.push( getPassedTopicList.slice( (i - 1) * 10,  topicReserveCount.valueOf() ) );
        console.log(getPassedTopicList.slice( (i - 1) * 10,  topicReserveCount.valueOf() ));
      }
    }
    console.log("arr1 : " + arr1);
    

    //return res.render('ex_debate_list', { topics: topics });

    const viewDto = await this.appService.createViewDto(session);

    return res.render('ex_debate_list', {
      ...viewDto,
      getPassedTopicList: getPassedTopicList,
      getEndTimeList: getEndTimeList,
      //topicReserves: topicReserves,
      topics: topics,
      topicReserveCount: topicReserveCount,
      topicReservePageCount: topicReservePageCount,
    });
  }

  // id로 해당 주제 예약번호 받아옴
  @Get('/view/:id')
  async getChat(
    @Param('id', ParseIntPipe) reserveId: number,
    @Session() session,
    @Res() res,
  ) {
    // reserveId 가 유효한지 확인
    const topicReserve: TopicReserve =
      await this.topicServices.findOnePassedTopicReserve(reserveId);
    if (topicReserve) {
      session.reserveId = reserveId;
      const viewDto = await this.appService.createViewDto(session);
      viewDto.topic = await this.listService.setTopicDto(reserveId);
      this.logger.debug(`viewDto: ${JSON.stringify(viewDto, null, 4)}`);
      return res.render('ex_Debate_show', viewDto);
    } else {
      throw new NotFoundException();
    }
  }
}
