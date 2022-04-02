import { Body, Controller, Post } from '@nestjs/common';

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
}
