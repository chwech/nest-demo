import {
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { StatusText } from './lib/statusText.decorator';
import { UserDto } from './users/users.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('user')
  @StatusText('获取用户信息成功')
  getUser(@Request() req): UserDto {
    console.log('用户信息');
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @HttpCode(200)
  async login(@Request() req) {
    console.log('登录**');
    // 登录成功后, req对象上会挂上用户信息
    return this.authService.login(req.user);
  }
}
