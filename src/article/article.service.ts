import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

interface PageParams {
  page: number;
  per_page: number;
}

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    return await this.articleRepository.insert(createArticleDto);
  }

  async findAll(options: PageParams) {
    console.log(options, 'options');
    const [data, total] = await this.articleRepository.findAndCount({
      skip: (Number(options.page) - 1) * Number(options.per_page),
      take: Number(options.per_page),
    });

    return {
      data,
      total,
      current_page: Number(options.page),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
