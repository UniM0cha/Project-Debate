import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import e from 'express';

import { lastValueFrom } from 'rxjs';
import { UserDataDto } from 'src/dto/userdata.dto';
import { Users } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import { KakaoUserDto } from './dto/kakao.user.dto';

const SERVER_URL = `localhost:3000`;
const KAKAO_REST_API_KEY = `ff5db7469114a5d6adfbdbc19d58501a`;
const NAVER_CLIENT_ID = `3ZYCyJm99tF7H49oxtHq`;
const NAVER_CLIENT_SECRET = `_WTAqF5gdE`;
const NAVER_RANDOM_STATE = `hollyshit`;
const GOOGLE_CLINET_ID = `880048515831-a3467he7oalogte46it7n2b38hvgvj59.apps.googleusercontent.com`;
const GOOGLE_CLINET_SECRET = `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`;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private httpService: HttpService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  getAccessCodeUrl(platform: string): string {
    let _encodedRedirectUri;
    // 추후에 보안을 위해 state 값 추가해야함
    switch (platform) {
      case 'kakao':
        _encodedRedirectUri = encodeURI(
          `http://${SERVER_URL}/auth/redirect/kakao`,
        );
        return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${_encodedRedirectUri}&response_type=code`;

      case 'naver':
        _encodedRedirectUri = encodeURI(
          `http://${SERVER_URL}/auth/redirect/naver`,
        );
        return `https://nid.naver.com/oauth2.0/authorize?client_id=${NAVER_CLIENT_ID}&redirect_uri=${_encodedRedirectUri}&response_type=code&state=${NAVER_RANDOM_STATE}`;

      case 'google':
        _encodedRedirectUri = encodeURI(
          `http://${SERVER_URL}/auth/redirect/google`,
        );
        return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLINET_ID}&redirect_uri=${_encodedRedirectUri}&response_type=code&scope=profile email openid`;
      default:
        throw new NotFoundException();
    }
  }

  async getAccessToken(platform: string, accessCode: string): Promise<any> {
    const _header = {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    let _url: string;
    let _encodedRedirectUri;

    switch (platform) {
      case 'kakao':
        _encodedRedirectUri = encodeURI(
          `http://${SERVER_URL}/auth/redirect/kakao`,
        );
        _url = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${_encodedRedirectUri}&code=${accessCode}`;
        return await lastValueFrom(
          this.httpService.post(_url, '', { headers: _header }),
        );

      case 'naver':
        _encodedRedirectUri = encodeURI(
          `http://${SERVER_URL}/auth/redirect/naver`,
        );
        _url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&redirect_uri=${_encodedRedirectUri}&code=${accessCode}`;
        return await lastValueFrom(
          this.httpService.post(_url, '', { headers: _header }),
        );

      case 'google':
        _encodedRedirectUri = encodeURI(
          `http://${SERVER_URL}/auth/redirect/google`,
        );
        _url = `https://oauth2.googleapis.com/token?grant_type=authorization_code&client_id=${GOOGLE_CLINET_ID}&client_secret=${GOOGLE_CLINET_SECRET}&redirect_uri=${_encodedRedirectUri}&code=${accessCode}`;
        return await lastValueFrom(
          this.httpService.post(_url, '', { headers: _header }),
        );

      default:
        throw new NotFoundException();
    }
  }

  async getUserInfo(
    platform: string,
    accessToken?: any,
    jwt?: string,
  ): Promise<any> {
    let _url: string;
    let _header = {
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    switch (platform) {
      case 'kakao':
        _url = `https://kapi.kakao.com/v2/user/me`;
        break;
      case 'naver':
        _url = `https://openapi.naver.com/v1/nid/me`;
        break;
      case 'google':
        let userInfo = this.jwtService.decode(jwt);
        return userInfo;
        break;
      default:
        throw new NotFoundException();
    }

    return await lastValueFrom(
      this.httpService.post(_url, '', { headers: _header }),
    );
  }

  async validateUser(
    platform: string,
    platformId: string,
    email: string,
  ): Promise<{ state: number; user: Users }> {
    /**
     * 0 : 로그인 요청
     * 1 : 중복 이메일 로그인 요청
     * 2 : 회원가입 요청
     */
    const emailUser: Users = await this.usersService.findByPlatform(
      'email',
      email,
    );
    if (!emailUser) {
      // 회원가입
      this.logger.debug(`회원가입 요청`);

      return { state: 2, user: null };
    }

    let isPlatformId: boolean;
    switch (platform) {
      case 'naver':
        isPlatformId = emailUser.naverId === platformId;
        break;
      case 'kakao':
        isPlatformId = emailUser.kakaoId === platformId;
        break;
      case 'google':
        isPlatformId = emailUser.googleId === platformId;
        break;
    }

    if (emailUser && isPlatformId) {
      this.logger.debug(`로그인 요청`);
      return { state: 0, user: emailUser };
    }

    if (emailUser && !isPlatformId) {
      this.logger.debug(`중복 이메일 로그인 요청`);
      return { state: 1, user: emailUser };
    }
  }

  async setAuthDto(userId: string): Promise<AuthDto> {
    let isLogined: boolean = userId ? true : false;
    let nickname: string = null;
    if (isLogined) {
      nickname = await this.usersService.findNickname(userId);
    }
    return new AuthDto(isLogined, nickname, userId);
  }
  // async setAuthDto(session: Record<string, any>): Promise<AuthDto> {
  //   session.save();
  //   let isLogined: boolean = session.isLogined;
  //   let nickname: string = null;
  //   let userId: string = null;

  //   // 로그인 체크
  //   if (session.isLogined) {
  //     isLogined = true;
  //     nickname = session.userData.nickname;
  //     userId = session.userData.userId;
  //   } else {
  //     isLogined = false;
  //     nickname = null;
  //     userId = null;
  //   }

  //   return new AuthDto(isLogined, nickname, userId);
  // }

  async login(user: Users): Promise<string> {
    const payload = { userId: user.userId };
    return this.jwtService.sign(payload);
  }

  async addPlatformId(platform: string, user: Users, platformId: string) {
    await this.usersService.updatePlatformId(platform, user.email, platformId);
    return;
  }
}
