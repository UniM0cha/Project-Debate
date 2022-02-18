import {
  Controller,
  Get,
  Logger,
  Post,
  Render,
  Res,
  Session,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ChatService } from './chat/chat.service';
import { ViewDto } from './dto/view.dto';
import { Chat } from './chat/chat.entity';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private readonly chatServices: ChatService,
  ) {}
  private readonly logger = new Logger(AppController.name);

  @Get('/')
  @Render('index')
  async root(@Session() session: Record<string, any>) {
    session.reserveId = await this.appService.getCurrentReserveId();
    const viewDto = await this.appService.createViewDto(session);

    viewDto.hasOpinion = await this.appService.checkHasOpinion(viewDto.userId);
    viewDto.topic = await this.appService.setIndexTopicDto();

    this.logger.debug(`viewDto: ${JSON.stringify(viewDto, null, 4)}`);
    return viewDto;
  }

  @Post('/time')
  sendTime() {}

  @Get('/test')
  @Render('test')
  test() {}
}
