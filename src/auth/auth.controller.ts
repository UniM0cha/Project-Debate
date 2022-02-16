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
import { Response } from 'express';
import { UserDataDto } from 'src/dto/userdata.dto';
import { Users } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { KakaoUserDto } from './dto/kakao.user.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private authService: AuthService,
    private usersSerivce: UsersService,
  ) {}

  /**
   * GET /auth
   * 로그인 페이지 렌더
   */
  @Get('/')
  loginPage(@Session() session, @Res() res) {
    if (session.isLogined) {
      return res.redirect('/');
    } else {
      return res.render('login');
    }
  }

  @Get('login/kakao')
  @HttpCode(200)
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  @Get('redirect/kakao')
  @HttpCode(200)
  @UseGuards(AuthGuard('kakao'))
  async kakaoRedirect(@Req() req): Promise<{ access_token: string }> {
    return this.authService.kakaoLogin(req.user as KakaoUserDto);
  }

  /**
   * GET /auth/login/:platform
   * 로그인 페이지에서 플랫폼 로그인 클릭
   * @returns
   */
  @Get('login/:platform')
  login(@Session() session, @Param('platform') platform, @Res() res) {
    if (session.isLogined) {
      return res.redirect('/');
    }

    switch (platform) {
      case 'kakao':
        this.logger.debug(`Kakao Login Request`);
        return res.redirect(this.authService.getAccessCodeUrl('kakao'));
      case 'naver':
        this.logger.debug(`Naver Login Request`);
        return res.redirect(this.authService.getAccessCodeUrl('naver'));
      case 'google':
        this.logger.debug(`Google Login Request`);
        return res.redirect(this.authService.getAccessCodeUrl('google'));
      default:
        throw new NotFoundException();
    }
  }

  /**
   * GET /auth/redirect/:platform
   * @param qs 플랫폼으로부터 받아온 엑세스 코드
   * @param res 리다이렉트를 위한 response
   * @param session 세션
   * @returns
   */
  @Get('redirect/:platform')
  async loginRedirect(
    @Query() qs,
    @Res() res: Response,
    @Session() session: Record<string, any>,
    @Param('platform') platform,
  ) {
    let accessCode: string;
    let token: any;
    let accessToken: string;
    let userInfo: any;
    let platformId: string;
    let idUser: Users;
    let email: string;
    let emailUser: Users;

    switch (platform) {
      /** 카카오 */
      case 'kakao':
        accessCode = qs.code;
        this.logger.debug(`Response Access_Code from Kakao: ${accessCode}`);

        token = await this.authService.getAccessToken(platform, accessCode);
        this.logger.debug(
          `Response Token_Data from Kakao: ${JSON.stringify(
            token.data,
            null,
            4,
          )}`,
        );
        accessToken = token.data['access_token'];

        userInfo = await this.authService.getUserInfo(platform, accessToken);
        this.logger.debug(
          `Response User_Info from Kakao: ${JSON.stringify(
            userInfo.data,
            null,
            4,
          )}`,
        );

        platformId = userInfo.data.id;
        idUser = await this.usersSerivce.findByPlatform(platform, platformId);

        email = userInfo.data.kakao_account.email;
        emailUser = await this.usersSerivce.findByPlatform('email', email);

        break;

      /** 네이버 */
      case 'naver':
        accessCode = qs.code;
        this.logger.debug(`Response Access_Code from Naver: ${accessCode}`);

        token = await this.authService.getAccessToken(platform, accessCode);
        this.logger.debug(
          `Response Token_Data from Naver: ${JSON.stringify(
            token.data,
            null,
            4,
          )}`,
        );
        accessToken = token.data['access_token'];

        userInfo = await this.authService.getUserInfo(platform, accessToken);
        this.logger.debug(
          `Response User_Info from Naver: ${JSON.stringify(
            userInfo.data,
            null,
            4,
          )}`,
        );

        platformId = userInfo.data.response.id;
        idUser = await this.usersSerivce.findByPlatform(platform, platformId);

        email = userInfo.data.response.email;
        emailUser = await this.usersSerivce.findByPlatform('email', email);

        break;

      /** 구글 */
      case 'google':
        accessCode = qs.code;
        this.logger.debug(`Response Access_Code from Google: ${accessCode}`);

        token = await this.authService.getAccessToken(platform, accessCode);
        this.logger.debug(
          `Response Token_Data from Google: ${JSON.stringify(
            token.data,
            null,
            4,
          )}`,
        );
        let IdToken = token.data['id_token'];

        userInfo = await this.authService.getUserInfo(platform, null, IdToken);
        this.logger.debug(
          `Response User_Info from Google: ${JSON.stringify(
            userInfo,
            null,
            4,
          )}`,
        );

        platformId = userInfo.aud;
        idUser = await this.usersSerivce.findByPlatform(platform, platformId);

        email = userInfo.email;
        emailUser = await this.usersSerivce.findByPlatform('email', email);

        break;

      default:
        throw new NotFoundException();
    }

    if (emailUser) {
      if (idUser) {
        // 로그인
        this.logger.debug(`Login Request`);

        const userData = new UserDataDto(idUser.userId, idUser.nickname);
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
          return res.redirect('/');
        });
      } else {
        // 플랫폼 아이디 추가 후 로그인
        this.logger.debug(`Add Platform Request`);
        await this.usersSerivce.updatePlatformId(platform, email, platformId);

        const userData = new UserDataDto(emailUser.userId, emailUser.nickname);
        // await this.authService.login(session, userData);
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

          return res.send(
            `<script>
              alert('같은 이메일로 가입한 계정이 있습니다. 기존 계정으로 로그인합니다.');
              location.href='/';
            </script>`,
          );
        });

        // return res.redirect('/');
      }
    } else {
      // 회원가입
      this.logger.debug(`Register Request`);
      // 이메일과 platform, platformId를 세션에 등록 후 회원가입 페이지로 이동
      const registerData = {
        email: email,
        platform: platform,
        platformId: platformId,
      };
      session.registerData = registerData;
      session.save((err) => {
        if (err) throw err;
        return res.redirect('/auth/register');
      });
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
      `Received Session Data Before Register: ${JSON.stringify(
        session,
        null,
        4,
      )}`,
    );

    // 플랫폼 로그인을 했는지 확인
    if (session.registerData && !session.isLogined) {
      return res.render('register');
    } else {
      return res.redirect('/');
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
      res.redirect('/');
      this.logger.error('회원가입 실패: 로그인 정보 없음');
      return;
    }

    const email = session.registerData.email;
    const platform = session.registerData.platform;
    const platformId = session.registerData.platformId;

    // 중복 체크하여 문제 있을 경우 데이터 처리하지 않고 상태코드만 전달
    const state: number = await this.usersSerivce.nicknameCheck(nickname);
    if (state !== 0) {
      return res.json(state);
    }

    // 데이터베이스 저장
    const user: Users = new Users();
    user.setUser(nickname, email, platform, platformId);
    const savedUser = await this.usersSerivce.save(user);

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
      return res.json(state);
    });
  }

  /**
   * GET /auth/logout
   * 로그아웃 요청 시
   */
  @Get('logout')
  async logout(@Session() session: Record<string, any>, @Res() res) {
    this.logger.debug(`Logout Request`);
    delete session.userData;
    session.isLogined = false;
    session.save((err) => {
      if (err) throw err;
      return res.redirect('/');
    });
  }
}
