export class AuthDto {
  isLogined: boolean;
  nickname: string;
  userId: string;

  constructor(_isLogined: boolean, _nickname: string, _userId: string) {
    this.isLogined = _isLogined;
    this.nickname = _nickname;
    this.userId = _userId;
  }
}
