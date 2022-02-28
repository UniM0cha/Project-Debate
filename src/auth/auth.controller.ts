import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
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

  // @Get('login/google')
  // @HttpCode(200)
  // @UseGuards(AuthGuard('google'))
  // async googleLogin() {
  //   this.logger.debug(`카카오 로그인 요청`);
  //   return HttpStatus.OK;
  // }

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

  // @Get('redirect/google')
  // @HttpCode(200)
  // @UseGuards(AuthGuard('google'))
  // async googleRedirect(
  //   @Req() req,
  //   @Res({ passthrough: true }) res: Response,
  //   @Session() session,
  // ) {
  //   const googleUser: GoogleUserDto = req.user as GoogleUserDto;

  //   await this.loginRegister(
  //     res,
  //     session,
  //     'google',
  //     googleUser.googleId,
  //     googleUser.email,
  //     googleUser.profileImage,
  //   );
  // }

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
      res.cookie('access_token', access_token, { httpOnly: true });
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
    await res.cookie('access_token', access_token, { httpOnly: true });

    // 로그인 완료되고 가입시에 저장한 데이터 삭제, 상태코드 전송
    delete session.registerData;
    res.json(state);
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token').redirect('/');
  }
}
