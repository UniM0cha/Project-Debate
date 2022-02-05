export class UserDataDto {
  constructor(userId: string, nickname: string) {
    this.userId = userId;
    this.nickname = nickname;
  }
  readonly userId: string;
  readonly nickname: string;
}
