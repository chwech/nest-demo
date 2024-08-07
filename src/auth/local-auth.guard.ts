import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// 给要使用passport-local策略的路由使用
// 为什么这样做，因为要消除魔法数字
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
