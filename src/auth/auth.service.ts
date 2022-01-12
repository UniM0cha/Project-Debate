import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { UserDataDto } from 'src/dto/userdata.dto';

const SERVER_URL = `localhost:3000`;
const KAKAO_REST_API_KEY = `ff5db7469114a5d6adfbdbc19d58501a`;
const NAVER_CLIENT_ID = `3ZYCyJm99tF7H49oxtHq`;
const NAVER_CLIENT_SECRET = `_WTAqF5gdE`;
const NAVER_RANDOM_STATE = `hollyshit`;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private httpService: HttpService) {}

  getAccessCodeUrl(platform: string): string {
    switch (platform) {
      case 'kakao':
        return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=http://${SERVER_URL}/auth/redirect/kakao&response_type=code`;

      case 'naver':
        const _encodedRedirectUri = encodeURI(
          `http://${SERVER_URL}/auth/redirect/naver`,
        );
        return `https://nid.naver.com/oauth2.0/authorize?client_id=${NAVER_CLIENT_ID}&redirect_uri=${_encodedRedirectUri}&response_type=code&state=${NAVER_RANDOM_STATE}`;

      case 'google':
        return `//////////////////////////////////////////////////////////////////////////`;
      default:
        throw new NotFoundException();
    }
  }

  async getAccessToken(platform: string, accessCode: string): Promise<any> {
    const _header = {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    let _url: string;

    switch (platform) {
      case 'kakao':
        _url = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=http://${SERVER_URL}/auth/redirect/kakao&code=${accessCode}`;
        return await lastValueFrom(
          this.httpService.post(_url, '', { headers: _header }),
        );

      case 'naver':
        _url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&redirect_uri=http://${SERVER_URL}/auth/redirect/naver&code=${accessCode}`;
        return await lastValueFrom(
          this.httpService.post(_url, '', { headers: _header }),
        );

      case 'google':
        return;

      default:
        throw new NotFoundException();
    }
  }

  async getUserInfo(platform: string, accessToken: any): Promise<any> {
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
        break;
      default:
        throw new NotFoundException();
    }

    return await lastValueFrom(
      this.httpService.post(_url, '', { headers: _header }),
    );
  }

  login(session: Record<string, any>, userData: UserDataDto) {
    session.userData = userData;
    session.isLogined = true;
    session.regenerate((err) => {
      if (err) throw err;
      this.logger.debug(
        `Generated Session Data After Login: ${JSON.stringify(
          session,
          null,
          4,
        )}`,
      );
    });
  }

  async logout(session: Record<string, any>): Promise<any> {
    // 세션 삭제
    await session.destroy((err) => {
      if (err) throw err;
    });
    return;
  }
}
