import { Controller, Get, Query } from '@nestjs/common';
import { WechatUserService } from './user.service';

@Controller('wechat/user')
export class WechatUserController {
  constructor(private readonly wechatUserService: WechatUserService) {}
  @Get()
  async getUsers(@Query('nextOpenId') nextOpenId) {
    return this.wechatUserService.getUserList(nextOpenId);
  }
}
