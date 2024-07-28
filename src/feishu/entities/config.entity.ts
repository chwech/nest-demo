import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

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
}