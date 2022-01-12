import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  Session,
} from '@nestjs/common';
import { Response } from 'express';
import { UserDataDto } from 'src/dto/userdata.dto';
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

  /**
   * GET /auth
   * 로그인 페이지 렌더
   */
  @Get('/')
  loginPage(@Session() session, @Res() res) {
    if (session.isLogined) {
      return res.redirect('/');
    } else {
      res.render('login');
    }
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

    // TODO : 구글
    // TODO : 네이버
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
        idUser = await this.usersSerivce.findUser(platform, platformId);

        email = userInfo.data.kakao_account.email;
        emailUser = await this.usersSerivce.findUser('email', email);

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
          `Response User_Info from Kakao: ${JSON.stringify(
            userInfo.data,
            null,
            4,
          )}`,
        );

        platformId = userInfo.data.response.id;
        idUser = await this.usersSerivce.findUser(platform, platformId);

        email = userInfo.data.response.email;
        emailUser = await this.usersSerivce.findUser('email', email);

        break;

      /** 구글 */
      case 'google':
        break;

      default:
        throw new NotFoundException();
    }

    this.logger.debug(`emailUser: ${emailUser}`);
    this.logger.debug(`idUser: ${idUser}`);

    if (emailUser) {
      if (idUser) {
        // 로그인
        const userData = new UserDataDto(idUser.userId, idUser.nickname);
        this.authService.login(session, userData);

        return res.redirect('/');
      } else {
        // 플랫폼 아이디 추가 후 로그인
        await this.usersSerivce.updatePlatformId(platform, email, platformId);

        const userData = new UserDataDto(emailUser.userId, emailUser.nickname);
        this.authService.login(session, userData);

        return res.redirect('/');
      }
    } else {
      // 회원가입
      // 이메일과 platform, platformId를 세션에 등록 후 회원가입 페이지로 이동
      const registerData = {
        email: email,
        platform: platform,
        platformId: platformId,
      };
      session.registerData = registerData;
      session.regenerate((err) => {
        if (err) throw err;
        this.logger.debug(
          `Generated Session Data: ${JSON.stringify(session, null, 4)}`,
        );
      });
      res.redirect('/auth/register');
    }
  }

  /**
   * GET /auth/register
   * 닉네임을 입력하기 위한 페이지 컨트롤러
   * @param session
   * @returns
   */
  @Get('register')
  async register(@Session() session: Record<string, any>, @Res() res) {
    // 플랫폼 로그인을 했는지 확인
    if (session.registerData && !session.isLogined) {
      res.render('register');
    } else {
      res.redirect('/');
    }
  }

  /**
   * POST /auth/register
   * 닉네임 입력 페이지에서 nickname을 받아와서 디비에 저장
   * @param session
   * @Body nickname
   */
  @Post('register')
  async getNickname(
    @Session() session: Record<string, any>,
    @Body('nickname') nickname: string,
    @Res() res,
  ) {
    // 회원가입에 필요한 데이터가 없다면 메인페이지로
    if (!session.registerData) {
      res.redirect('/');
    }

    const email = session.registerData.email;
    const platform = session.registerData.platform;
    const platformId = session.registerData.platformId;

    // 들어오자마자 세션 데이터를 삭제해서 뒤끝 없게...
    delete session.registerData;

    // 중복 체크
    const user: Users = await this.usersSerivce.findByNickname(nickname);
    if (user) {
      // 중복된 닉네임의 유저가 있을 때에 여기로 들어옴.
      // 프론트쪽에서 닉네임 중복체크를 확실하게 해줘야함... 여기로 들어오면 안돼
      throw new BadRequestException(null, 'Nickname has overlapped!!!');
    } else {
      // 데이터베이스 저장
      const user: Users = new Users();
      user.nickname = nickname;
      user.email = email;

      switch (platform) {
        case 'kakao':
          user.kakaoId = platformId;
          break;
        case 'naver':
          user.naverId = platformId;
          break;
        case 'google':
          user.googleId = platformId;
          break;
      }

      const savedUser = await this.usersSerivce.save(user);

      // 로그인
      const userData = new UserDataDto(savedUser.userId, savedUser.nickname);
      this.authService.login(session, userData);

      // 사실 여기서 회원가입을 환영하는 페이지를 주는게 좋을 듯...
      res.redirect('/');
    }
  }

  /**
   * GET /auth/logout
   */
  @Get('logout')
  async logout(@Session() session: Record<string, any>, @Res() res) {
    this.logger.debug(`Logout Request`);
    await this.authService.logout(session);
    res.redirect('/');
  }
}
