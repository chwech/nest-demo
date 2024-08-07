import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 实体是一个映射到数据库表的类。用Entity装饰器标记
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Exclude()
  @Column({ type: 'text' })
  password: string;

  @Column()
  iv: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
