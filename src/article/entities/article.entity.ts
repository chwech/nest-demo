import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('timestamp')
  create_at: string;

  @Column('timestamp')
  update_at: string;
}
