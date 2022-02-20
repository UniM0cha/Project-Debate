import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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

  async login(user: Users): Promise<string> {
    const payload = { userId: user.userId };
    return this.jwtService.sign(payload);
  }

  async addPlatformId(platform: string, user: Users, platformId: string) {
    await this.usersService.updatePlatformId(platform, user.email, platformId);
    return;
  }
}
