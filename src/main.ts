import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './auth/auth.guard';
// import { ResponseInterceptor } from './lib/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 获取端口配置
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  // 允许跨域
  app.enableCors();
  // 绑定全局守卫
  app.useGlobalGuards(new AuthGuard());
  // 绑定全局拦截器
  // app.useGlobalInterceptors(new ResponseInterceptor());

  // 验证请求数据, 配合dto和class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.listen(port);
}

bootstrap();
