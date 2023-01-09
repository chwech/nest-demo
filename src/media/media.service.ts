import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadService } from 'src/upload/upload.service';
import { Repository } from 'typeorm';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media, MediaType } from './entities/media.entity';

interface PageParams {
  page: number;
  per_page: number;
}

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private readonly uploadService: UploadService,
  ) {}
  async create(createMediaDto: CreateMediaDto) {
    return this.update(createMediaDto);
  }

  async findAll(options: PageParams) {
    const [data, total] = await this.mediaRepository.findAndCount({
      skip: (options.page - 1) * options.per_page,
      take: options.per_page,
    });

    return {
      data,
      total,
      current_page: options.page,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(mediaDto: UpdateMediaDto) {
    const { mimeType, title, name, ...media } = mediaDto;
    return this.mediaRepository.save({
      ...media,
      name,
      title: title ?? name,
      mimeType: MediaType[mimeType],
    });
  }

  async remove(key: string) {
    await this.uploadService.deleteFile(key);
    return this.mediaRepository.delete({ url: key });
  }
}
