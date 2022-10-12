import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // super可以传递策略选项
    super();
  }

  // 实现valitate验证
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);

    // 验证不通过, 抛出错误
    if (!user) {
      throw new BadRequestException('账号或密码错误');
    }

    // 验证成功返回用户信息
    return user;
  }
}
