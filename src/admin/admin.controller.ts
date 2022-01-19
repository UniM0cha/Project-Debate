import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { TopicReserve } from 'src/topic/entity/topic-reservation.entity';
import { Topic } from 'src/topic/entity/topic.entity';
import { TopicService } from 'src/topic/topic.service';
import { ReserveDto } from './dto/reserve.dto';
import { TopicDto } from './dto/topic.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly topicService: TopicService) {}
  private readonly logger = new Logger(AdminController.name);

  // 추후에 권한 있는 사람만 접근 가능하도록 만들 것
  @Get('/')
  main(@Res() res) {
    return res.render('admin/main');
  }

  @Get('/topic')
  async topic(@Res() res) {
    // test!!!!!!
    await this.topicService.addTestData();

    const topicReserves: TopicReserve[] =
      await this.topicService.findAllTopicReserves();
    const topics: Topic[] = await this.topicService.findAllTopics();

    return res.render('admin/topic', {
      topicReserves: topicReserves,
      topics: topics,
    });
  }

  /** 주제 조회 */
  @Get('/topic/:id')
  async getTopic(@Param('id') id: number, @Res() res) {
    const topic: Topic = await this.topicService.findOneTopic(id);
    return res.render('admin/topic_detail', { topic: topic });
  }

  /** 주제 추가 */
  @Post('new-topic')
  async createNewTopic(@Body() body: TopicDto, @Res() res) {
    this.logger.debug(`body: ${JSON.stringify(body, null, 4)}`);
    await this.topicService.createTopic(body);
    return res.redirect('/admin/topic');
  }

  /** 주제 수정 */
  @Post('update-topic/:id')
  async updateTopic(
    @Param('id') id: number,
    @Body() body: TopicDto,
    @Res() res,
  ) {
    this.logger.debug(`id: ${id}, body: ${JSON.stringify(body, null, 4)}`);
    await this.topicService.updateTopic(id, body);
    res.redirect('/admin/topic');
  }

  /** 주제 삭제 */
  @Post('delete-topic/:id')
  async deleteTopic(@Param('id') id: number, @Res() res) {
    await this.topicService.deleteTopic(id);
    res.redirect('/admin/topic');
  }

  /** 예약 조회 */
  @Get('/reserve/:id')
  async getReserve(@Param('id') id: number, @Res() res) {
    const reserve: TopicReserve = await this.topicService.findOneTopicReserve(
      id,
    );
    this.logger.debug(`reserve: ${JSON.stringify(reserve)}`);
    const topics: Topic[] = await this.topicService.findAllTopics();
    return res.render('admin/reserve_detail', {
      reserve: reserve,
      topics: topics,
    });
  }

  /** 예약 추가 */
  @Post('new-reserve')
  async createNewReserve(@Body() body: ReserveDto, @Res() res) {
    this.logger.debug(`body: ${JSON.stringify(body, null, 4)}`);
    await this.topicService.createReserve(body);
    res.redirect('/admin/topic');
  }

  @Post('update-reserve/:id')
  async updateRserve(
    @Param('id') id: number,
    @Body() body: ReserveDto,
    @Res() res,
  ) {
    this.logger.debug(`id: ${id}, body: ${JSON.stringify(body, null, 4)}`);
    await this.topicService.updateReserve(id, body);
    res.redirect('/admin/topic');
  }

  @Post('delete-reserve/:id')
  async deleteRserve(@Param('id') id: number, @Res() res) {
    this.logger.debug(`id: ${id}`);

    await this.topicService.deleteReserve(id);

    res.redirect('/admin/topic');
  }
}
