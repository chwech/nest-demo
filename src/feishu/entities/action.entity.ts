import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Config } from './config.entity';

@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: number

  @Column()
  chatId: string

  @Column()
  buyinNickname: string



  @Column()
  status: number



  @Column()
  productIndex: number

  @Column()
  num: number

  @Column({ nullable: true })
  endMinutes: number
}