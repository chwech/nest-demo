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
