import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { QueryQiniuTokenDto } from './dto/query-qiniu-token.dto';
import { UploadService } from './upload.service';
import { AxiosResponse } from 'axios';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

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
  token(@Query() query: QueryQiniuTokenDto) {
    return this.uploadService.getQiniuToken(query);
  }

  @Get('domains')
  async getQiniuDomains(@Query('bucketName') bucketName: string) {
    return await this.uploadService.getQiniuDomains(bucketName);
  }
}
