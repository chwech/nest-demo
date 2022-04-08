import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 绑定全局守卫
  app.useGlobalGuards(new AuthGuard());
  await app.listen(3000);
}
bootstrap();
