import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { lastValueFrom } from 'rxjs';
import { UserDataDto } from 'src/dto/userdata.dto';
import { Users } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';

const SERVER_URL = `debatalk.ddns.net`;
const KAKAO_REST_API_KEY = `114fbc070b3563572db5fe6be76b2ae8`;
const NAVER_CLIENT_ID = `OzobY4hdweiTJHUmbhNn`;
const NAVER_CLIENT_SECRET = `__B9xmG_FB`;
const NAVER_RANDOM_STATE = `hollyshit`;
const GOOGLE_CLINET_ID = `241359741651-24t8rj9mpjktd4h5urgqotfvk908rsla.apps.googleusercontent.com`;
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

  async validateUser(userId: string): Promise<Users> {
    const user = this.usersService.findOneById(userId);
    if (!user) {
      return null;
    } else {
      return user;
    }
  }

  async setAuthDto(session: Record<string, any>): Promise<AuthDto> {
    session.save();
    let isLogined: boolean = session.isLogined;
    let nickname: string = null;
    let userId: string = null;

    // 로그인 체크
    if (session.isLogined) {
      isLogined = true;
      nickname = session.userData.nickname;
      userId = session.userData.userId;
    } else {
      isLogined = false;
      nickname = null;
      userId = null;
    }

    return new AuthDto(isLogined, nickname, userId);
  }
}
