import {
  Controller,
  Get,
  Logger,
  Render,
  Req,
  Session,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { UsersService } from 'src/users/users.service';

@Controller('profile')
@UseFilters(new HttpExceptionFilter())
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  @Render('profile')
  async showProfile(@Req() req, @Session() session) {
    const authDto: AuthDto = await this.authService.setAuthDto(
      req?.user?.userId,
    );
    this.logger.debug(`authDto: ${JSON.stringify(authDto)}`);
    return authDto;

    // 이메일 - 변경 불가
    // 별명 - 중복 확인 코드 삽입
    // 적용 / 취소 버튼
  }
}
