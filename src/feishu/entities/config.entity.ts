import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Action } from './action.entity';

@Entity()
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number

  @Column()
  taskDuration: number

  @Column()
  actionDuration: number

  @Column()
  startTimeDuration: number

  @Column()
  endTimeDuration: number

  @Column()
  endTimeHour: number

  @Column()
  amount: number

  @Column()
  chatId: string

  @Column()
  buyinNickname: string // 昵称，给机器人补券方便使用

  @Column()
  buyinAccountId: string
}