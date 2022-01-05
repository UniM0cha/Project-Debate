const REDIRECT_URI = `localhost:3000`;

import {
  Controller,
  Get,
  Logger,
  Param,
  Query,
  Redirect,
  Render,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Get('/')
  @Render('login')
  loginPage() {}

  @Get('login')
  @Redirect()
  login() {
    this.logger.debug(`Kakao Login Request`);
    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey = 'ff5db7469114a5d6adfbdbc19d58501a';
    const _redirectUri = `http://${REDIRECT_URI}/auth/redirect`;
    const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUri}&response_type=code`;
    return { url: url };

    // TODO : 구글
    // TODO : 네이버
  }

  @Get('redirect')
  async loginRedirect(@Query() qs, @Res() res: Response) {
    // 엑세스 코드로 엑세스 토큰 받기
    const accessCode = qs.code;
    this.logger.debug(`Kakao Login access_token: ${accessCode}`);

    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey = 'ff5db7469114a5d6adfbdbc19d58501a';
    let _header = {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    const _redirectUri = `http://${REDIRECT_URI}/auth/redirect`;
    let _url = `${_hostName}/oauth/token?grant_type=authorization_code&client_id=${_restApiKey}&redirect_uri=${_redirectUri}&code=${accessCode}`;

    const token = await this.authService.login(_url, _header);
    this.logger.debug(
      `Response Data from Kakao: ${JSON.stringify(token.data)}`,
    );
    const accessToken = token.data['access_token'];

    // 엑세스 토큰으로 유저 정보 가져오기mmㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    _url = `${_hostName}/v2/user/me?grant_type=authorization_code&client_id=${_restApiKey}&redirect_uri=${_redirectUri}&code=${accessCode}`;

    // const userInfo = await this.authService.getUserInfo(accessToken);

    // TODO : 받은 토큰을 통해 사용자 정보 불러오기
    // TODO : 받은 사용자 정보를 세션에 저장

    return res.redirect(`http://${REDIRECT_URI}/`);
  }

  @Get('status')
  status() {}

  @Get('logout')
  logout() {}
}
