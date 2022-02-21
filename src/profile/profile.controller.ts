import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Render,
  Req,
  Res,
  Session,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { Users } from 'src/users/users.entity';
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

  @Post('edit')
  @UseGuards(AuthGuard('jwt'))
  async editProfile(
    @Body() body: { nickname: string },
    @Res() res,
    @Req() req,
  ) {
    this.logger.debug(JSON.stringify(body));
    const userId: string = req?.user?.userId;
    const nickname: string = body.nickname;

    // 중복 체크하여 문제 있을 경우 데이터 처리하지 않고 상태코드만 전달
    const state: number = await this.usersService.nicknameCheck(nickname);
    if (state !== 0) {
      res.json(state);
      return;
    }

    // 데이터베이스 업데이트
    const updateState: number = await this.usersService.updateProfile(userId, {
      nickname: nickname,
    });
    if (updateState !== 0) {
      res.json(updateState);
      return;
    }

    // 로그인 완료되고 가입시에 저장한 데이터 삭제, 상태코드 전송
    res.json(0);
    return;
  }
}
