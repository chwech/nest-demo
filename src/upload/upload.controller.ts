import { Body, Controller, Get, Post } from '@nestjs/common';
import * as qiniu from 'qiniu';
@Controller('upload')
export class UploadController {
  @Post()
  upload(@Body() body) {
    console.log(body);
    return { code: 200 };
  }

  @Post()
  mergeChunk() {
    return { code: 200 };
  }

  @Get('token')
  token() {
    const accessKey = '_V0UGMIRy_bOG5mG20ZXALwq8zcRt5sOObDzNwXg';
    const secretKey = 'xUU4q3HQ66eV9KyCqnhvxVUNMxJ-LMmKKN4qztT5';
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
      scope: 'www-chwech-com',
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    return putPolicy.uploadToken(mac);
  }
}
