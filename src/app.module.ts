import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoodController } from './good/good.controller';
import { UploadController } from './upload/upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wechat } from './wechat/wechat.entity';
import { WechatModule } from './wechat/wechat.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin_chwech',
      database: 'test',
      entities: [Wechat],
      synchronize: true,
    }),
    AuthModule,
    PassportModule,
    WechatModule,
    UsersModule,
  ],
  controllers: [AppController, GoodController, UploadController],
  providers: [AppService, LocalStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 应用中间件
    consumer.apply(LoggerMiddleware).forRoutes('wechat');
  }
}
