import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
  Redirect,
  Render,
  Res,
  Session,
} from '@nestjs/common';
import { Response } from 'express';
import { Users } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private authService: AuthService,
    private usersSerivce: UsersService,
  ) {}

  @Get('/')
  @Render('login')
  loginPage() {}

  @Get('login')
  @Redirect()
  login() {
    this.logger.debug(`Kakao Login Request`);
    const url = this.authService.getAccessCode();
    return { url: url };

    // TODO : 구글
    // TODO : 네이버
  }

  @Get('redirect')
  async loginRedirect(
    @Query() qs,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    const accessCode = qs.code;
    this.logger.debug(`Response Access_Token from Kakao: ${accessCode}`);

    // Get Access Token
    const token = await this.authService.getAccessToken(accessCode);
    this.logger.debug(
      `Response Token_Data from Kakao: ${JSON.stringify(token.data, null, 4)}`,
    );
    const accessToken = token.data['access_token'];

    // Get User Info
    const userInfo = await this.authService.getUserInfo(accessToken);
    this.logger.debug(
      `Response User_Data from Kakao: ${JSON.stringify(
        userInfo.data,
        null,
        4,
      )}`,
    );

    const authData = {
      ...token.data,
      ...userInfo.data,
    };

    session.isLogined = true;
    session.regenerate((err) => {
      if (err) throw err;
      this.logger.debug(
        `Generated Session Data: ${JSON.stringify(session, null, 4)}`,
      );
    });

    /**
     * 받아온 카카오id가 중복되는 사람이 있으면 로그인이다. -> 그 사람의 user_id를 받아온다
     * 등록된 카카오id가 없다면 회원가입이다. -> 닉네임을 입력하게 한다.
     */

    const isUser: Users = await this.usersSerivce.findUser(
      'kakao',
      authData.id,
    );
    if (isUser) {
      this.logger.debug('User Exist!');
    } else {
      this.logger.debug('User NonExist!');
      const user: Users = new Users();
      user.nickname = 'test';
      user.platform = 'kakao';
      user.kakaoId = authData.id;
      this.usersSerivce.save(user);
    }

    return res.redirect(`http://localhost:3000/`);
  }

  @Get('logout')
  @Redirect('/')
  async logout(@Session() session: Record<string, any>) {
    this.logger.debug(`Kakao Logout Request`);

    // TODO : 카카오측에 요청하여 토큰 만료시킴
    const accessToken = session.authData.access_token;
    this.logger.debug(accessToken);
    await this.authService.logout(accessToken);

    // TODO : 세션에 등록된 사용자 정보 삭제
    session.destroy((err) => {
      if (err) throw err;
    });
  }

  @Get('status')
  status() {}
}
