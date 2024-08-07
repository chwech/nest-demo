import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoodController } from './good/good.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wechat } from './wechat/wechat.entity';
import { WechatModule } from './wechat/wechat.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { User } from './users/user.entity';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './lib/response.interceptor';
import { ArticleModule } from './article/article.module';
import { Article } from './article/entities/article.entity';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvFilePath } from './utils/env';
import configuration from './config/configuration';
import { UploadModule } from './upload/upload.module';
import { ItemModule } from './item/item.module';
import { Item } from './item/entities/item.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { MediaModule } from './media/media.module';
import { Media } from './media/entities/media.entity';
import { FeiShuModule } from './feishu/feishu.module';
import { Config } from './feishu/entities/config.entity';
import { Action } from './feishu/entities/action.entity';
import * as winston from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

// 根模块

@Module({
  // 导入模块的列表，这些模块导出了此模块中所需提供者
  imports: [
    // 定时任务
    ScheduleModule.forRoot(),
    // 配置模块（环境变量）
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath({
        suffix: process.env.NODE_ENV,
      }),
      load: [configuration],
      isGlobal: true, // 注册为全局模块，使用configService在全局可用，不需要到时导入
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
        entities: [
          User,
          Wechat,
          Article,
          Category,
          Item,
          Media,
          Config,
          Action,
        ],
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
    UploadModule,
    ItemModule,
    MediaModule,
    FeiShuModule,
    CacheModule.register({
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      // options (same as WinstonModule.forRoot() options)
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('buyin', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'combined.log',
        }),
      ],
    }),
  ],

  // 控制器
  controllers: [AppController, GoodController],

  // 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享
  // 将提供者放在providers数组里，nest才能正确执行注入
  providers: [
    AppService,
    // 全局守卫
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // 全局拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],

  // 由本模块提供并应在其他模块中可用的提供者的子集。
  // 从模块导出的提供程序(提供者)视为模块的公共接口或API。
  // exports: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 应用中间件
    consumer.apply(LoggerMiddleware).forRoutes('wechat');
  }
}
