import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  userId: string;

  @Column()
  nickname: string;

  @Column()
  platform: string;

  @Column({ nullable: true })
  kakaoId: string;

  @Column({ nullable: true })
  naverId: string;

  @Column({ nullable: true })
  googleId: string;
}
