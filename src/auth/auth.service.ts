import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  check: boolean;
  accessToken: string;
  constructor(private httpService: HttpService) {
    this.check = false;
    this.accessToken = '';
  }

  loginCheck(): void {
    this.check = !this.check;
    return;
  }

  async login(url: string, header: any): Promise<any> {
    return await lastValueFrom(
      this.httpService.post(url, '', { headers: header }),
    );
  }

  setTocken(token: string): boolean {
    this.accessToken = token;
    return true;
  }

  async logout(): Promise<any> {
    const _url = 'https://kapi.kakao.com/v1/user/logout';
    const _header = {
      Authorization: `bearer ${this.accessToken}`,
    };
    return await lastValueFrom(
      this.httpService.post(_url, '', { headers: _header }),
    );
  }

  async deleteLog(): Promise<any> {
    const _url = 'https://kapi.kakao.com/v1/user/unlink';
    const _header = {
      Authorization: `bearer ${this.accessToken}`,
    };
    return await lastValueFrom(
      this.httpService.post(_url, '', { headers: _header }),
    );
  }
}
