import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoodController } from './good/good.controller';
import { UploadController } from './upload/upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wechat } from './wechat/wechat.entity';
import { WechatModule } from './wechat/wechat.module';

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

    WechatModule,
  ],
  controllers: [AppController, GoodController, UploadController],
  providers: [AppService],
})
export class AppModule {}
