import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret-jwt-chwech-app',
    });
  }

  async validate(payload: any) {
    // 验证不通过, 抛出错误
    // 验证成功返回用户信息
    return { userId: payload.sub, username: payload.username };
  }
}
