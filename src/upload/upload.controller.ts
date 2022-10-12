import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as qiniu from 'qiniu';

@Controller('upload')
export class UploadController {
  constructor(private readonly configService: ConfigService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'upload/');
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  @Post('file')
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);

    return file.originalname;
  }

  @Post()
  mergeChunk() {
    return { code: 200 };
  }

  @Get('token')
  token() {
    const accessKey = this.configService.get('qiniu.ak');
    const secretKey = this.configService.get('qiniu.sk');

    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
      scope: 'www-chwech-com',
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    return putPolicy.uploadToken(mac);
  }
}
