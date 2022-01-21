import { Controller, Get, Param, Render, Session } from '@nestjs/common';
import session from 'express-session';
import { ViewDto } from 'src/dto/view.dto';

@Controller('list')
export class ListController {
  @Get('/')
  @Render('ex_debate_list')
  list(@Session() session: Record<string, any>) {
    // let sessionDto = new ViewDto(session);
    // return sessionDto;
  }
}
