import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import session from 'express-session';
import { AdminAuthGuard } from 'src/auth/passport/admin.guard';
import { Role } from 'src/auth/passport/roles.decorator';
import { RolesGuard } from 'src/auth/passport/roles.guard';
import { TopicReserve } from 'src/topic/entity/topic-reservation.entity';
import { Topic } from 'src/topic/entity/topic.entity';
import { TopicService } from 'src/topic/topic.service';
import { UserRole } from 'src/users/users.entity';
import { AdminService } from './admin.service';
import { ReserveDto } from './dto/reserve.dto';
import { TopicDto } from './dto/topic.dto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Role(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly topicService: TopicService,
    private readonly adminService: AdminService,
  ) {}
  private readonly logger = new Logger(AdminController.name);

  // 추후에 권한 있는 사람만 접근 가능하도록 만들 것
  @Get('/')
  async main(@Res() res) {
    res.render('admin/main');
  }

  @Get('/topic')
  async topic(@Res() res) {
    // test!!!!!!
    //await this.topicService.addTestData();

    const topicReserves: TopicReserve[] =
      await this.topicService.findAllTopicReservesWithTopic();
    const topics: Topic[] = await this.topicService.findAllTopics();

    res.render('admin/topic', {
      topicReserves: topicReserves,
      topics: topics,
    });
  }

  /** 주제 조회 */
  @Get('/topic/:id')
  async getTopic(@Param('id') id: number, @Res() res) {
    const topic: Topic = await this.topicService.findOneTopic(id);
    res.render('admin/topic_detail', { topic: topic });
  }

  /** 주제 추가 */
  @Post('new-topic')
  async createNewTopic(@Body() body: TopicDto, @Res() res) {
    this.logger.debug(`body: ${JSON.stringify(body, null, 4)}`);
    await this.topicService.createTopic(body);
    res.redirect('/admin/topic');
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
    const reserve: TopicReserve =
      await this.topicService.findOneTopicReserveWithTopic(id);
    this.logger.debug(`reserve: ${JSON.stringify(reserve)}`);
    const topics: Topic[] = await this.topicService.findAllTopics();
    res.render('admin/reserve_detail', {
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
