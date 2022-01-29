import { Injectable, Logger } from '@nestjs/common';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    // // User 엔티티 형태를 처리한 레포지토리를 주입
    // @InjectRepository(User)
    // private userRepository: Repository<User>,

    // 커스텀 레포지토리 사용(주입)
    private usersRepository: UsersRepository,
  ) {}

  async findAll(): Promise<Users[]> {
    return await this.usersRepository.find();
  }

  async findOneById(id: string): Promise<Users> {
    return await this.usersRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async save(user: Users): Promise<Users> {
    const savedUser = await this.usersRepository.save(user);
    return savedUser;
  }

  async findByPlatform(method: string, id: string): Promise<Users> {
    if (method === 'kakao') {
      const user = await this.usersRepository.findByKakaoId(id);
      return user;
    }

    if (method === 'naver') {
      const user = await this.usersRepository.findByNaverId(id);
      return user;
    }

    if (method === 'google') {
      const user = await this.usersRepository.findByGoogleId(id);
      return user;
    }

    if (method === 'email') {
      const user = await this.usersRepository.findByEmail(id);
      return user;
    }
  }

  async findByNickname(nickname: string): Promise<Users> {
    const user = await this.usersRepository.findByNickname(nickname);
    return user;
  }

  async updatePlatformId(
    platform: string,
    email: string,
    platformId: string,
  ): Promise<void> {
    switch (platform) {
      case 'kakao':
        await this.usersRepository.updateKakaoId(email, platformId);
        break;

      case 'naver':
        await this.usersRepository.updateNaverId(email, platformId);
        break;

      case 'google':
        await this.usersRepository.updateGoogleId(email, platformId);
        break;
    }
    return;
  }

  async findAllNickname(): Promise<string[]> {
    const users: Users[] = await this.usersRepository.find({
      select: ['nickname'],
    });
    const list = users.map((users) => users.nickname);
    return list;
  }

  async nicknameCheck(nickname: string): Promise<number> {
    /**상태코드
     * 0 : 사용 가능
     * 1 : 중복
     * 2 : 형식 지키지 않음
     */
    const findName = await this.usersRepository.findByNickname(nickname);
    if (!findName) {
      const acceptRegex = /^[\w가-힇ㄱ-ㅎ]+$/g;
      if (acceptRegex.test(nickname)) {
        this.logger.debug('사용 가능한 닉네임');
        return 0;
      } else {
        this.logger.error('사용 불가능한 닉네임: 형식에 맞지 않음');
        return 2;
      }
    } else {
      this.logger.error('사용 불가능한 닉네임: 중복된 닉네임');
      return 1;
    }
  }
}
