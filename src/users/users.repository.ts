import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { Users } from './users.entity';

@EntityRepository(Users)
export class UsersRepository extends Repository<Users> {
  async updateGoogleId(
    email: string,
    platformId: string,
  ): Promise<UpdateResult> {
    return await this.update({ email: email }, { googleId: platformId });
  }

  async updateNaverId(
    email: string,
    platformId: string,
  ): Promise<UpdateResult> {
    return await this.update({ email: email }, { naverId: platformId });
  }

  async updateKakaoId(
    email: string,
    platformId: string,
  ): Promise<UpdateResult> {
    return await this.update({ email: email }, { kakaoId: platformId });
  }

  async findByEmail(email: string): Promise<Users> {
    return await this.findOne({ email: email });
  }

  async findByNickname(nickname: string): Promise<Users> {
    return await this.findOne({ nickname: nickname });
  }

  async findByKakaoId(id: string): Promise<Users> {
    return await this.findOne({ kakaoId: id });
  }

  async findByNaverId(id: string): Promise<Users> {
    return await this.findOne({ naverId: id });
  }

  async findByGoogleId(id: string): Promise<Users> {
    return await this.findOne({ googleId: id });
  }
}
