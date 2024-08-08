import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UserDto } from './users.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(200)
  create(@Body() createArticleDto: CreateUserDto) {
    return this.userService.create(createArticleDto);
  }

  @Get()
  findAll(@Query() query: QueryUserDto) {
    return this.userService.findAll(query);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateArticleDto: UserDto) {
    return this.userService.update(id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}


