import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { Wechat } from './wechat.entity';

@Injectable()
export class WechatService {
  constructor(
    @InjectRepository(Wechat)
    private wechatRepository: Repository<Wechat>,
  ) {}

  async fetchAccessToken() {
    const res = await axios.get(
      'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxf5e91d9a8d1511ec&secret=49caebd69e9959cf8b12a108cf46d7b5',
    );
    const wechat = new Wechat();
    wechat.id = 1;
    wechat.accessToken = res.data.access_token;
    wechat.expiresIn = res.data.expires_in;
    wechat.expires = new Date(
      Date.now() + res.data.expires_in * 1000,
    ).toUTCString();

    this.wechatRepository.save(wechat);

    return wechat.accessToken;
  }

  async getAccessToken() {
    const wechat = await this.wechatRepository.findOne(1);

    if (wechat) {
      if (new Date(wechat.expires).getTime() > Date.now()) {
        return wechat.accessToken;
      } else {
        return this.fetchAccessToken();
      }
    } else {
      return this.fetchAccessToken();
    }
  }
}
