import { Controller, Get, Logger, Render, Res, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { ViewDto } from './dto/view.dto';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}
  private readonly logger = new Logger(AppController.name);

  @Get('/')
  @Render('index')
  async root(@Session() session: Record<string, any>) {
    const viewDto = await this.appService.createViewDto(session);
    this.logger.debug(`viewDto: ${JSON.stringify(viewDto, null, 4)}`);
    return viewDto;
  }
}
