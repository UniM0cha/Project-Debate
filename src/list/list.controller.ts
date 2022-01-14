import { Controller, Get, Render, Session } from '@nestjs/common';
import session from 'express-session';
import { SessionDto } from 'src/dto/session.dto';

@Controller('list')
export class ListController {
  @Get('/')
  @Render('ex_debate_list')
  list(@Session() session: Record<string, any>) {
    let sessionDto = new SessionDto(session);
    return sessionDto;
  }
}
