import { Body, Controller, Logger, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new Logger(UsersController.name);

  @Post('list')
  async getNicknameList(): Promise<string[]> {
    const list: string[] = await this.usersService.findAllNickname();
    return list;
  }

  @Post('check')
  async nicknameCheck(@Body() body): Promise<number> {
    const nickname = body.nickname;
    const state: number = await this.usersService.nicknameCheck(nickname);
    return state;
  }
}
