import {
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/exception/exception.filter';
import { ValidatePipe } from 'src/pipe/validate.pipe';
import { getReqRawBody, sha1 } from 'src/utils';
import * as convert from 'xml-js';
import { WechatService } from './wechat.service';

@Controller('wechat')
export class WechatController {
  constructor(private wechatService: WechatService) {}

  @Get('checkSignature')
  @UsePipes(new ValidatePipe())
  @UseFilters(new HttpExceptionFilter())
  checkSignature(@Query() query) {
    console.log('控制器');

    const token = 'learnweichatdevelop';
    const { signature, echostr, timestamp, nonce } = query;
    // 1. 字典序排序
    const array = [token, timestamp, nonce];
    array.sort();
    // 2. sha1加密
    const result = sha1(array.join(''));
    // 3. 与微信返回的签名比较，如果相等，验证通过返回echostr给微信
    if (result === signature) {
      return echostr;
    } else {
      return false;
    }
  }

  @Post('checkSignature')
  async reMessage(@Req() req, @Res() res) {
    try {
      const body = await getReqRawBody(req);

      const {
        xml: {
          ToUserName: { _cdata: toUserName },
          FromUserName: { _cdata: fromUserName },
          MsgType: { _cdata: msgType },
          Content: { _cdata: content } = { _cdata: '' },
          Event: { _cdata: event } = { _cdata: '' },
          PicUrl: { _cdata: picUrl } = { _cdata: '' },
          MediaId: { _cdata: mediaId } = { _cdata: '' },
        },
      } = convert.xml2js(body, {
        compact: true,
      }) as { xml: { [prop: string]: any } };

      console.log('body', body, toUserName, fromUserName, msgType, content);
      if (msgType === 'event') {
        if (event === 'subscribe') {
          const responseData = {
            xml: {
              ToUserName: { _cdata: fromUserName },
              FromUserName: { _cdata: toUserName },
              CreateTime: { _text: Date.now() },
              MsgType: { _cdata: 'text' },
              Content: {
                _cdata: '你好，欢迎关注我的公众号\n回复1获取更多信息',
              },
            },
          };
          const xml = convert.js2xml(responseData, {
            compact: true,
            spaces: 2,
          });
          res.status(200).send(xml);
        }
      } else if (msgType === 'text') {
        const responseData = {
          xml: {
            ToUserName: { _cdata: fromUserName },
            FromUserName: { _cdata: toUserName },
            CreateTime: { _text: Date.now() },
            MsgType: { _cdata: 'text' },
            Content: { _cdata: 'hello world!' },
          },
        };
        const xml = convert.js2xml(responseData, {
          compact: true,
          spaces: 2,
        });
        if (content == 1) {
          res.status(200).send(xml);
        } else {
          res.status(200).send('');
        }
      } else if (msgType === 'image') {
        console.log(picUrl, mediaId);
      }
    } catch {
      res.status(200).send('');
    }
  }

  @Get('getAccessToken')
  async getAccessToken() {
    return await this.wechatService.getAccessToken();
  }

  @Get('refresh')
  refreshAccessToken() {
    return this.wechatService.fetchAccessToken();
  }
}
