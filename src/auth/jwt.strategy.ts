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

  // 对于jwt策略，passport首先验证jwt的签名并解码jwt，然后调用validate
  async validate(payload: any) {
    // 这里已经保证验证成功，我们仅需要的是返回用户信息
    return { userId: payload.sub, username: payload.username }; // validate方法的返回值会挂到req.user属性上，可供路由处理程序使用
  }
}
