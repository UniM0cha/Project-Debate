import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    // mysql config
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'debate',
      password: 'mochamocha',
      database: 'debate',
      // entities: [User],
      // 이 옵션은 forFeature() 메소드를 통해 등록된 모든 엔티티가 자동 추가된다.
      autoLoadEntities: true,

      // Setting synchronize makes sure your entities will be synced with the database, every time you run the application.
      // synchronize: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
