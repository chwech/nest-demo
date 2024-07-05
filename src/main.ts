import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './auth/auth.guard';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { ResponseInterceptor } from './lib/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 获取端口配置
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  console.log(__dirname, '__dirname');

  // 允许跨域
  app.enableCors();

  // 静态文件目录
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // 视图模板目录
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // 模板引擎
  app.setViewEngine('hbs');

  // 绑定全局守卫
  app.useGlobalGuards(new AuthGuard());
  // 绑定全局拦截器
  // app.useGlobalInterceptors(new ResponseInterceptor());
  // 序列化
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // 验证请求数据, 配合dto和class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(port);
}

bootstrap();
