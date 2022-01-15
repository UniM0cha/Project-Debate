import { Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('list')
  async getNicknameList(): Promise<string[]> {
    const list: string[] = await this.usersService.findAllNickname();
    return list;
  }
}
