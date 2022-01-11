import { EntityRepository, Repository } from 'typeorm';
import { Users } from './users.entity';

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {
  async findByNickname(nickname: string): Promise<Users> {
    return this.findOne({ nickname: nickname });
  }
  async findByKakaoId(id: string): Promise<Users> {
    return this.findOne({ kakaoId: id });
  }
}
