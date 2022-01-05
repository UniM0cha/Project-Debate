import { Controller, Get, Render } from '@nestjs/common';

@Controller('list')
export class ListController {
  @Get('/')
  @Render('ex_debate_list')
  list() {
    return;
  }
}
