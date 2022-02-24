export class AuthDto {
  isLogined: boolean;
  nickname: string;
  userId: string;
  profileImage: string;
  email: string;

  constructor(
    _isLogined: boolean,
    _userId: string,
    _nickname: string,
    _profileImage: string,
    _email: string,
  ) {
    this.isLogined = _isLogined;
    this.userId = _userId;
    this.nickname = _nickname;
    this.profileImage = _profileImage;
    this.email = _email;
  }
}
