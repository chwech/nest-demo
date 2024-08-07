import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EncrytHelper } from 'src/utils/helper';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({ secret: 'secret-jwt-chwech-app' }),
    UsersModule,
  ],

  controllers: [AuthController],

  providers: [AuthService, LocalStrategy, JwtStrategy, EncrytHelper],

  exports: [AuthService],
})
export class AuthModule {}
