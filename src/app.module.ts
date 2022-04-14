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
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  // 导入模块的列表，这些模块导出了此模块中所需提供者
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

  // 控制器
  controllers: [AppController, GoodController, UploadController],

  // 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享
  providers: [AppService, LocalStrategy, JwtStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 应用中间件
    consumer.apply(LoggerMiddleware).forRoutes('wechat');
  }
}
