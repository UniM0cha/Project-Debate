import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import e, { Response } from 'express';
import { session } from 'passport';
import { UserDataDto } from 'src/dto/userdata.dto';
import { Users } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { GoogleUserDto } from './dto/google.user.dto';
import { KakaoUserDto } from './dto/kakao.user.dto';
import { NaverUserDto } from './dto/naver.user.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  /**
   * GET /auth
   * 로그인 페이지 렌더
   */
  @Get('/')
  loginPage(@Session() session, @Res() res) {
    if (session.isLogined) {
      res.redirect('/');
    } else {
      res.render('login');
    }
  }

  @Get('login/naver')
  @HttpCode(200)
  @UseGuards(AuthGuard('naver'))
  async naverLogin() {
    this.logger.debug(`카카오 로그인 요청`);
    return HttpStatus.OK;
  }

  @Get('login/kakao')
  @HttpCode(200)
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    this.logger.debug(`카카오 로그인 요청`);
    return HttpStatus.OK;
  }

  @Get('login/google')
  @HttpCode(200)
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    this.logger.debug(`카카오 로그인 요청`);
    return HttpStatus.OK;
  }

  @Get('redirect/naver')
  @HttpCode(200)
  @UseGuards(AuthGuard('naver'))
  async naverRedirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Session() session,
  ) {
    const naverUser: NaverUserDto = req.user as NaverUserDto;

    await this.loginRegister(
      res,
      session,
      'naver',
      naverUser.naverId,
      naverUser.email,
      naverUser.profileImage,
    );
  }

  @Get('redirect/kakao')
  @HttpCode(200)
  @UseGuards(AuthGuard('kakao'))
  async kakaoRedirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Session() session,
  ) {
    const kakaoUser: KakaoUserDto = req.user as KakaoUserDto;

    await this.loginRegister(
      res,
      session,
      'kakao',
      kakaoUser.kakaoId,
      kakaoUser.email,
      kakaoUser.profileImage,
    );
  }

  @Get('redirect/google')
  @HttpCode(200)
  @UseGuards(AuthGuard('google'))
  async googleRedirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Session() session,
  ) {
    const googleUser: GoogleUserDto = req.user as GoogleUserDto;

    await this.loginRegister(
      res,
      session,
      'google',
      googleUser.googleId,
      googleUser.email,
      googleUser.profileImage,
    );
  }

  async loginRegister(
    res: Response,
    session: any,
    platform: string,
    platformId: string,
    email: string,
    profileImage: string,
  ) {
    const { state, user } = await this.authService.validateUser(
      platform,
      platformId,
      email,
    );

    if (state === 0) {
      // 로그인
      const access_token = await this.authService.login(user);
      this.logger.debug(`생성된 JWT 토큰: ${JSON.stringify(access_token)}`);
      await res.cookie('access_token', access_token, { httpOnly: true });
      res.redirect('/');
    }
    //
    else if (state === 1) {
      // 플랫폼 아이디 추가 후 로그인
      await this.authService.addPlatformId(platform, user, platformId);
      const access_token = await this.authService.login(user);
      await res.cookie('Authorization', access_token, { httpOnly: true });
      res.send(
        `<script>
          alert('같은 이메일로 가입한 계정이 있습니다. 기존 계정으로 로그인합니다.');
          location.href='/';
        </script>`,
      );
    }
    //
    else if (state === 2) {
      // 회원가입
      // 이메일과 platform, platformId를 세션에 등록 후 회원가입 페이지로 이동
      session.registerData = {
        email: email,
        platform: platform,
        platformId: platformId,
        profileImage: profileImage,
      };

      res.send(
        `<script>
          alert('로그인 정보가 없습니다. 회원가입을 진행합니다.');
          location.href='/auth/register';
        </script>`,
      );
    }
  }

  /**
   * GET /auth/login/:platform
   * 로그인 페이지에서 플랫폼 로그인 클릭
   * @returns
   */
  // @Get('login/:platform')
  // login(@Session() session, @Param('platform') platform, @Res() res) {
  //   if (session.isLogined) {
  //     res.redirect('/');
  //   }

  //   switch (platform) {
  //     case 'kakao':
  //       this.logger.debug(`Kakao Login Request`);
  //       res.redirect(this.authService.getAccessCodeUrl('kakao'));
  //     case 'naver':
  //       this.logger.debug(`Naver Login Request`);
  //       res.redirect(this.authService.getAccessCodeUrl('naver'));
  //     case 'google':
  //       this.logger.debug(`Google Login Request`);
  //       res.redirect(this.authService.getAccessCodeUrl('google'));
  //     default:
  //       throw new NotFoundException();
  //   }
  // }

  // /**
  //  * GET /auth/redirect/:platform
  //  * @param qs 플랫폼으로부터 받아온 엑세스 코드
  //  * @param res 리다이렉트를 위한 response
  //  * @param session 세션
  //  * @returns
  //  */
  // @Get('redirect/:platform')
  // async loginRedirect(
  //   @Query() qs,
  //   @Res() res: Response,
  //   @Session() session: Record<string, any>,
  //   @Param('platform') platform,
  // ) {
  //   let accessCode: string;
  //   let token: any;
  //   let accessToken: string;
  //   let userInfo: any;
  //   let platformId: string;
  //   let idUser: Users;
  //   let email: string;
  //   let emailUser: Users;

  //   switch (platform) {
  //     /** 카카오 */
  //     case 'kakao':
  //       accessCode = qs.code;
  //       this.logger.debug(`Response Access_Code from Kakao: ${accessCode}`);

  //       token = await this.authService.getAccessToken(platform, accessCode);
  //       this.logger.debug(
  //         `Response Token_Data from Kakao: ${JSON.stringify(
  //           token.data,
  //           null,
  //           4,
  //         )}`,
  //       );
  //       accessToken = token.data['access_token'];

  //       userInfo = await this.authService.getUserInfo(platform, accessToken);
  //       this.logger.debug(
  //         `Response User_Info from Kakao: ${JSON.stringify(
  //           userInfo.data,
  //           null,
  //           4,
  //         )}`,
  //       );

  //       platformId = userInfo.data.id;
  //       idUser = await this.usersService.findByPlatform(platform, platformId);

  //       email = userInfo.data.kakao_account.email;
  //       emailUser = await this.usersService.findByPlatform('email', email);

  //       break;

  //     /** 네이버 */
  //     case 'naver':
  //       accessCode = qs.code;
  //       this.logger.debug(`Response Access_Code from Naver: ${accessCode}`);

  //       token = await this.authService.getAccessToken(platform, accessCode);
  //       this.logger.debug(
  //         `Response Token_Data from Naver: ${JSON.stringify(
  //           token.data,
  //           null,
  //           4,
  //         )}`,
  //       );
  //       accessToken = token.data['access_token'];

  //       userInfo = await this.authService.getUserInfo(platform, accessToken);
  //       this.logger.debug(
  //         `Response User_Info from Naver: ${JSON.stringify(
  //           userInfo.data,
  //           null,
  //           4,
  //         )}`,
  //       );

  //       platformId = userInfo.data.response.id;
  //       idUser = await this.usersService.findByPlatform(platform, platformId);

  //       email = userInfo.data.response.email;
  //       emailUser = await this.usersService.findByPlatform('email', email);

  //       break;

  //     /** 구글 */
  //     case 'google':
  //       accessCode = qs.code;
  //       this.logger.debug(`Response Access_Code from Google: ${accessCode}`);

  //       token = await this.authService.getAccessToken(platform, accessCode);
  //       this.logger.debug(
  //         `Response Token_Data from Google: ${JSON.stringify(
  //           token.data,
  //           null,
  //           4,
  //         )}`,
  //       );
  //       let IdToken = token.data['id_token'];

  //       userInfo = await this.authService.getUserInfo(platform, null, IdToken);
  //       this.logger.debug(
  //         `Response User_Info from Google: ${JSON.stringify(
  //           userInfo,
  //           null,
  //           4,
  //         )}`,
  //       );

  //       platformId = userInfo.aud;
  //       idUser = await this.usersService.findByPlatform(platform, platformId);

  //       email = userInfo.email;
  //       emailUser = await this.usersService.findByPlatform('email', email);

  //       break;

  //     default:
  //       throw new NotFoundException();
  //   }

  //   if (emailUser) {
  //     if (idUser) {
  //       // 로그인
  //       this.logger.debug(`Login Request`);

  //       const userData = new UserDataDto(idUser.userId, idUser.nickname);
  //       session.userData = userData;
  //       session.isLogined = true;
  //       session.save((err) => {
  //         if (err) throw err;

  //         this.logger.debug(
  //           `Generated Session Data After Login: ${JSON.stringify(
  //             session,
  //             null,
  //             4,
  //           )}`,
  //         );
  //         res.redirect('/');
  //       });
  //     } else {
  //       // 플랫폼 아이디 추가 후 로그인
  //       this.logger.debug(`Add Platform Request`);
  //       await this.usersService.updatePlatformId(platform, email, platformId);

  //       const userData = new UserDataDto(emailUser.userId, emailUser.nickname);
  //       // await this.authService.login(session, userData);
  //       session.userData = userData;
  //       session.isLogined = true;
  //       session.save((err) => {
  //         if (err) throw err;

  //         this.logger.debug(
  //           `Generated Session Data After Login: ${JSON.stringify(
  //             session,
  //             null,
  //             4,
  //           )}`,
  //         );

  //         res.send(
  //           `<script>
  //             alert('같은 이메일로 가입한 계정이 있습니다. 기존 계정으로 로그인합니다.');
  //             location.href='/';
  //           </script>`,
  //         );
  //       });

  //       //  res.redirect('/');
  //     }
  //   } else {
  //     // 회원가입
  //     this.logger.debug(`Register Request`);
  //     // 이메일과 platform, platformId를 세션에 등록 후 회원가입 페이지로 이동
  //     const registerData = {
  //       email: email,
  //       platform: platform,
  //       platformId: platformId,
  //     };
  //     session.registerData = registerData;
  //     session.save((err) => {
  //       if (err) throw err;
  //       res.redirect('/auth/register');
  //     });
  //   }
  // }

  /**
   * GET /auth/register
   * 닉네임을 입력하기 위한 페이지 컨트롤러
   * @param session
   * @returns
   */
  @Get('register')
  async showRegisterPage(@Session() session: Record<string, any>, @Res() res) {
    this.logger.debug(
      `세션에서 받아온 회원가입 정보: ${JSON.stringify(session)}`,
    );

    // 플랫폼 로그인을 했는지 확인
    if (session.registerData) {
      res.render('register');
    } else {
      this.logger.error('회원가입 페이지 실패: 회원가입 정보 없음');
      res.redirect('/');
    }
  }

  /**
   * POST /auth/register
   * 클라이언트로부터 닉네임을 입력받아서
   * 닉네임이 저장 가능한지 검증하고
   * 유효한 닉네임이라면 회원가입 진행
   *
   * @param session -> 세션에서 OAuth 정보를 가져온다.
   * @param nickname -> 클라이언트가 입력한 닉네임
   * @param res -> 응답을 보내기 위함
   * @returns
   */
  @Post('register')
  async register(
    @Session() session: Record<string, any>,
    @Body('nickname') nickname: string,
    @Res() res,
  ) {
    // 회원가입에 필요한 데이터가 없다면 메인페이지로
    if (!session.registerData) {
      this.logger.error('회원가입 실패: 회원가입 정보 없음');
      res.redirect('/');
      return;
    }

    const { email, platform, platformId, profileImage } = session.registerData;

    // 중복 체크하여 문제 있을 경우 데이터 처리하지 않고 상태코드만 전달
    const state: number = await this.usersService.nicknameCheck(nickname);
    if (state !== 0) {
      res.json(state);
    }

    // 데이터베이스 저장
    const user: Users = new Users();
    user.setUser(nickname, email, platform, platformId, profileImage);
    const savedUser = await this.usersService.save(user);

    const access_token = await this.authService.login(savedUser);
    await res.cookie('Authorization', access_token, { httpOnly: true });

    // 로그인 완료되고 가입시에 저장한 데이터 삭제, 상태코드 전송
    delete session.registerData;
    res.json(state);

    /*
    // 로그인
    const userData = new UserDataDto(savedUser.userId, savedUser.nickname);

    session.userData = userData;
    session.isLogined = true;
    session.save((err) => {
      if (err) throw err;

      this.logger.debug(
        `Generated Session Data After Login: ${JSON.stringify(
          session,
          null,
          4,
        )}`,
      );

      // 로그인 완료되고 가입시에 저장한 데이터 삭제, 상태코드 전송
      delete session.registerData;
      res.json(state);
    });
    */
  }

  /**
   * GET /auth/logout
   * 로그아웃 요청 시
   */
  // @Get('logout')
  // async logout(@Session() session: Record<string, any>, @Res() res) {
  //   this.logger.debug(`Logout Request`);
  //   delete session.userData;
  //   session.isLogined = false;
  //   session.save((err) => {
  //     if (err) throw err;
  //     res.redirect('/');
  //   });
  // }
}
