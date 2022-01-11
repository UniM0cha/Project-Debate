import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ListModule } from './list/list.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.development' }),
    // mysql config
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.MYSQL_DB_HOST,
    //   port: Number.parseInt(process.env.MYSQL_DB_PORT),
    //   username: process.env.MYSQL_DB_USER,
    //   password: process.env.MYSQL_DB_PASS,
    //   database: process.env.MYSQL_DB_NAME,
    //   // entities: [User],
    //   // 이 옵션은 forFeature() 메소드를 통해 등록된 모든 엔티티가 자동 추가된다.
    //   autoLoadEntities: true,

    //   // Setting synchronize makes sure your entities will be synced with the database, every time you run the application.
    //   synchronize: true,
    //   dropSchema: true,
    // }),
    // UsersModule,
    HttpModule,
    AuthModule,
    ListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
