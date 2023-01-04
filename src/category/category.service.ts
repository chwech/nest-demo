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

  create(createCategoryDto: CreateCategoryDto) {
    return this.update(null, createCategoryDto);
  }

  findAll() {
    return this.entityManager.getTreeRepository(Category).findTrees({
      relations: ['parent'],
    });
  }

  findOne(id: number) {
    return this.categoryRepository.findOne(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const parent = await this.findOne(updateCategoryDto.parentId);
    const newCategory = { parent, ...updateCategoryDto, id };
    return this.categoryRepository.save(newCategory);
  }

  async remove(id: number) {
    const result = await this.entityManager.transaction(
      async (tem: EntityManager) => {
        const categoryRepository = tem.getRepository(Category);
        const metadata = categoryRepository.metadata;

        const table =
          metadata.closureJunctionTable.ancestorColumns[0].entityMetadata
            .tableName;
        const ancestor =
          metadata.closureJunctionTable.ancestorColumns[0].databasePath;
        const descendant =
          metadata.closureJunctionTable.descendantColumns[0].databasePath;

        // 找到子代ids
        const nodes = await tem
          .createQueryBuilder()
          .select(descendant)
          .from(table, 'closure')
          .where(`${ancestor} = :id`, { id: id })
          .getRawMany();

        const nodeIds = nodes.map((v) => v[descendant]).filter((v) => v !== id);

        // 要删除节点的父节点
        const parent = await tem
          .createQueryBuilder()
          .relation(Category, 'parent')
          .of(id)
          .loadOne();

        // 删除节点
        await categoryRepository.delete(id);

        if (parent) {
          // 将子代父节点设置为要删除节点的父节点
          await tem
            .createQueryBuilder()
            .relation(Category, 'parent')
            .of(nodeIds)
            .set(parent);
        }

        return id;
      },
    );
    return result;
  }
}
