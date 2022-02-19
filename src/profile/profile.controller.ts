import {
  Controller,
  Get,
  Logger,
  Post,
  Render,
  Req,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { AuthDto } from 'src/auth/dto/auth.dto';

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);
  constructor(private readonly authService: AuthService) {}

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  @Render('profile')
  async showProfile(@Req() req, @Session() session) {
    // 세션에서 로그인이 되어있는지 확인 - 안되어있으면 접근할 수 없도록
    // if (
    //   !(
    //     (session.userData && session.userData.userId)
    //     // (await this.authService.validateUser(session.userData.userId))
    //   )
    // ) {
    //   throw new UnauthorizedException();
    // }
    // const authDto: AuthDto = await this.authService.setAuthDto(session);
    // this.logger.debug(`viewDto: ${JSON.stringify(authDto)}`);
    // return authDto;
    // 이메일 - 변경 불가
    // 별명 - 중복 확인 코드 삽입
    // 적용 / 취소 버튼
  }
}
