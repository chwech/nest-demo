import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('good')
export class GoodController {
  // @Get()
  // getGood(@Req() request: Request) {
  //   console.log(request.query);
  //   return request.query.a;
  // }
}
