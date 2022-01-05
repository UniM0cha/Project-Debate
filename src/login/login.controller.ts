const REDIRECT_URI = `127.0.0.1:3000`;

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
import { hostname } from 'os';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  private readonly logger = new Logger(LoginController.name);
  constructor(private loginService: LoginService) {}

  @Get('/')
  @Render('login')
  login() {}

  // 카카오 로그인 버튼 클릭
  @Get('/kakao')
  @Redirect()
  kakaoLogin() {
    this.logger.debug(`Kakao Login Request`);
    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey = 'ff5db7469114a5d6adfbdbc19d58501a';
    const _redirectUri = `http://${REDIRECT_URI}/login/kakaoLoginRedirect`;
    const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUri}&response_type=code`;
    return { url: url };
  }

  // 카카오 측에서 리다이렉트
  @Get('/kakaoLoginRedirect')
  async kakaoLoginRedirect(@Query() qs, @Res() res: Response) {
    const accessCode = qs.code;
    this.logger.debug(`Kakao Login access_token: ${accessCode}`);

    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey = 'ff5db7469114a5d6adfbdbc19d58501a';
    const _header = {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    const _redirectUri = `http://${REDIRECT_URI}/login/kakaoLoginRedirect`;
    const _url = `${_hostName}/oauth/token?grant_type=authorization_code&client_id=${_restApiKey}&redirect_uri=${_redirectUri}&code=${accessCode}`;

    const e = await this.loginService.login(_url, _header);
    const accessToken = e.data['access_token'];
    this.logger.debug(`Kakao Access Token: ${accessToken}`);
    this.loginService.setTocken(accessToken);
    // TODO : 받은 토큰을 저장하는 방법 모

    return res.redirect(`http://${REDIRECT_URI}/`);
  }
}
