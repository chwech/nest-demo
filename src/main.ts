import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './auth/auth.guard';
// import { ResponseInterceptor } from './lib/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 允许跨域
  app.enableCors();
  // 绑定全局守卫
  app.useGlobalGuards(new AuthGuard());
  // 绑定全局拦截器
  // app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(3000);
}
bootstrap();
