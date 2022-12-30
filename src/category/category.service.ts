import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create({ parentId, ...category }: CreateCategoryDto) {
    const parent = await this.categoryRepository.findOne(parentId);
    const newCategory = { parent, ...category };
    return this.categoryRepository.save(newCategory);
  }

  findAll() {
    return this.entityManager.getTreeRepository(Category).findTrees();
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
