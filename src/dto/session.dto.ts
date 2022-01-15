export class SessionDto {
  constructor(session: Record<string, any>) {
    let _isLogined = session.isLogined;
    if (_isLogined) {
      this.isLogined = true;
      this.nickname = session.userData.nickname;
      this.userId = session.userData.userId;
    } else {
      this.isLogined = false;
      this.nickname = null;
      this.userId = null;
    }
  }

  readonly isLogined: boolean;
  readonly nickname: string;
  readonly userId: string;
}
