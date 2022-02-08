import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { lastValueFrom } from 'rxjs';
import { UserDataDto } from 'src/dto/userdata.dto';

const SERVER_URL = `112.151.4.252:13465`;
const KAKAO_REST_API_KEY = `ff5db7469114a5d6adfbdbc19d58501a`;
const NAVER_CLIENT_ID = `OzobY4hdweiTJHUmbhNn`;
const NAVER_CLIENT_SECRET = `__B9xmG_FB`;
const NAVER_RANDOM_STATE = `hollyshit`;
const GOOGLE_CLINET_ID = `880048515831-a3467he7oalogte46it7n2b38hvgvj59.apps.googleusercontent.com`;
const GOOGLE_CLINET_SECRET = `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`;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private httpService: HttpService,
    private jwtService: JwtService,
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
}
