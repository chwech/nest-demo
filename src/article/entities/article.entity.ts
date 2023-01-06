import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// 实体是一个映射到数据库表的类，@Entity()来标记
@Entity()
export class Article {
  // @PrimaryGeneratedColumn("uuid") 可以自动生成uuid
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  create_at: string;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  update_at: string;

  // 多对一关系
  // 文章包含一个分类，但是一个分类可以包含多篇文章
  // 文章是关系的拥有者，并存储分类的id（关联id和外键）
  @ManyToOne(() => Category)
  category: Category;

  constructor(partial: Partial<Article>) {
    Object.assign(this, partial);
  }
}
