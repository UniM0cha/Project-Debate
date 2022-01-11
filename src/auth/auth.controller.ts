import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
  Query,
  Redirect,
  Render,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { Response } from 'express';
import session from 'express-session';
import { retryWhen } from 'rxjs';
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

    // 인증내용 세션등록
    session.authData = authData;

    /**
     * 받아온 카카오id가 중복되는 사람이 있으면 로그인이다. -> 그 사람의 user_id를 받아와서 세션에 등록한다.
     * 등록된 카카오id가 없다면 회원가입이다. -> 닉네임을 입력하게 한다. -> 닉네임과 함께 db에 저장하고 세션에 등록한다.
     */

    const user: Users = await this.usersSerivce.findUser('kakao', authData.id);

    // 회원가입 여부 확인
    if (user) {
      this.logger.debug('User Exist!');

      const userData = {
        userId: user.userId,
        nickname: user.nickname,
      };

      // 유저 정보 세션 등록
      session.userData = userData;
      session.isLogined = true;
      session.regenerate((err) => {
        if (err) throw err;
        this.logger.debug(
          `Generated Session Data: ${JSON.stringify(session, null, 4)}`,
        );
      });

      return res.redirect(`http://localhost:3000/`);
    } else {
      this.logger.debug('User NonExist!');

      session.regenerate((err) => {
        if (err) throw err;
        this.logger.debug(
          `Generated Session Data: ${JSON.stringify(session, null, 4)}`,
        );
      });
      return res.redirect(`http://localhost:3000/auth/register`);
    }
  }

  /**
   * 닉네임을 입력하기 위한 페이지 컨트롤러
   * @param session
   * @returns
   *
   * 들어오면 안되는 경우 :
   * 1. 이미 로그인중일 때
   * 2. 이미 유저 정보가 존재할 때
   */
  @Get('register')
  @Render('register')
  async register(@Session() session: Record<string, any>) {
    if (session.isLogined) {
      return new BadRequestException();
    } else {
    }
  }

  /**
   * 닉네임 입력 페이지에서 nickname을 받아와서 디비에 저장
   * @param session
   * @Body nickname
   */
  @Post('register')
  @Redirect('/')
  async getNickname(
    @Session() session: Record<string, any>,
    @Body('nickname') nickname: string,
  ) {
    const user: Users = await this.usersSerivce.findByNickname(nickname);
    // 중복 체크
    if (user) {
    } else {
      // 데이터베이스 저장
      const user: Users = new Users();
      user.nickname = nickname;
      user.platform = 'kakao';
      user.kakaoId = session.authData.id;
      const savedUser = await this.usersSerivce.save(user);

      // 세션 등록
      const userData = {
        userId: savedUser.userId,
        nickname: savedUser.nickname,
      };
      session.userData = userData;
      session.isLogined = true;

      session.regenerate((err) => {
        if (err) throw err;
        this.logger.debug(
          `Generated Session Data: ${JSON.stringify(session, null, 4)}`,
        );
      });
    }
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
