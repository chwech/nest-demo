import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Render,
  Request,
  Sse,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { StatusText } from './lib/statustext.decorator';
import { UserDto } from './users/users.dto';
import { Cron } from '@nestjs/schedule';
import { Observable, interval, map } from 'rxjs';
import { ExcludeResIntercept } from './lib/exclude.response.intercept.decorator';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  @Render('index')
  @ExcludeResIntercept()
  root() {
    return { message: 'hello nest' };
  }

  @Get('register')
  createUser(@Query() params) {
    console.log('register', params);
    return this.userService.create(params);
  }

  @UseGuards(JwtAuthGuard)
  @StatusText('获取用户信息成功')
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user')
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

  // 控制器负责处理传入的请求和向官方端返回响应
  // @Get('test')
  @Cron('45 * * * * *')
  async test() {
    // console.log('console.log 45s');
    // await new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve(1);
    //   }, 5000);
    // });
    // const user = this.configService.get<string>('db.mysql.host');
    // console.log('NODE_ENV', process.env.NODE_ENV);
    // return user;
  }

  // @Get('/')
  // async index() {
  //   return 'hello nest.js';
  // }

  @Sse('sse')
  sse(): Observable<any> {
    return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } })));
  }
}
