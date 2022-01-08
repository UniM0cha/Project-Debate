import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { UsersService } from 'src/users/users.service';

const REDIRECT_URI = `localhost:3000`;
const REST_API_KEY = `ff5db7469114a5d6adfbdbc19d58501a`;

@Injectable()
export class AuthService {
  check: boolean;
  accessToken: string;
  constructor(
    private httpService: HttpService,
    private userService: UsersService,
  ) {
    this.check = false;
    this.accessToken = '';
  }

  getAccessCode(): string {
    const _redirectUri = `http://${REDIRECT_URI}/auth/redirect`;
    return `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${_redirectUri}&response_type=code`;
  }

  async getAccessToken(accessCode: string): Promise<any> {
    let _header = {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    const _redirectUri = `http://${REDIRECT_URI}/auth/redirect`;
    let _url = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${_redirectUri}&code=${accessCode}`;

    return await lastValueFrom(
      this.httpService.post(_url, '', { headers: _header }),
    );
  }

  async getUserInfo(accessToken: any): Promise<any> {
    const _url = `https://kapi.kakao.com/v2/user/me`;
    const _header = {
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    return await lastValueFrom(
      this.httpService.post(_url, '', { headers: _header }),
    );
  }

  async logout(accessToken: string): Promise<any> {
    const _url = `https://kapi.kakao.com/v1/user/logout`;
    const _header = {
      Authorization: `Bearer ${accessToken}`,
    };
    return await lastValueFrom(
      this.httpService.post(_url, '', { headers: _header }),
    );
  }

  // loginCheck(): void {
  //   this.check = !this.check;
  //   return;
  // }

  // setTocken(token: string): boolean {
  //   this.accessToken = token;
  //   return true;
  // }

  // async deleteLog(): Promise<any> {
  //   const _url = 'https://kapi.kakao.com/v1/user/unlink';
  //   const _header = {
  //     Authorization: `bearer ${this.accessToken}`,
  //   };
  //   return await lastValueFrom(
  //     this.httpService.post(_url, '', { headers: _header }),
  //   );
  // }
}
