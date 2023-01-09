import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { QueryMediaDto } from './dto/query-article.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  @Get()
  findAll(@Query() query: QueryMediaDto) {
    return this.mediaService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Patch()
  update(@Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(updateMediaDto);
  }

  @Delete()
  remove(@Body('key') key: string) {
    return this.mediaService.remove(key);
  }
}
