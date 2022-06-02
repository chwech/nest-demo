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
import { User } from './users/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './lib/response.interceptor';
import { ArticleModule } from './article/article.module';
import { Article } from './article/entities/article.entity';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvFilePath } from './utils/env';
import configuration from './config/configuration';

@Module({
  // 导入模块的列表，这些模块导出了此模块中所需提供者
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configSerivce: ConfigService) => ({
        type: 'mysql',
        host: configSerivce.get('db.mysql.host'),
        port: configSerivce.get('db.mysql.port'),
        username: configSerivce.get('db.mysql.username'),
        password: configSerivce.get('db.mysql.password'),
        database: configSerivce.get('db.mysql.database'),
        // 实体列表
        entities: [User, Wechat, Article, Category],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    PassportModule,
    WechatModule,
    UsersModule,
    ArticleModule,
    CategoryModule,
  ],

  // 控制器
  controllers: [AppController, GoodController, UploadController],

  // 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享
  // 将提供者放在providers数组里，nest才能正确执行注入
  providers: [
    AppService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 应用中间件
    consumer.apply(LoggerMiddleware).forRoutes('wechat');
  }
}
