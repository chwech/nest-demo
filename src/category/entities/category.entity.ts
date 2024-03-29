import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity()
@Tree('closure-table')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  slug: string;

  @Exclude()
  @TreeParent({
    onDelete: 'SET NULL',
  })
  parent: Category;

  @TreeChildren()
  children: Category[];

  @Expose()
  get parentId() {
    return this.parent?.id ?? 0;
  }
}
