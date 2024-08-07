import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { ResponseInterceptor } from './lib/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 文档
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // 获取端口配置
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  // 允许跨域
  app.enableCors();
  // 静态文件目录
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // 视图模板目录
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // 模板引擎
  app.setViewEngine('hbs');

  // 绑定全局守卫
  // app.useGlobalGuards(new AuthGuard());

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

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  await app.listen(port);
}

bootstrap();
