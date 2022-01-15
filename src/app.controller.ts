import { Controller, Get, Logger, Render, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { ViewDto } from './dto/view.dto';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}
  private readonly logger = new Logger(AppController.name);

  @Get('/')
  //사용할 템플릿 지정
  @Render('index')
  async root(@Session() session: Record<string, any>) {
    const viewDto = await this.appService.createViewDto(session);
    this.logger.debug(`viewDto: ${JSON.stringify(viewDto, null, 4)}`);
    return viewDto;

    // let sessionDto = new ViewDto(session);
    // return sessionDto;
  }
}
