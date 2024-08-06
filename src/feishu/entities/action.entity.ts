import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: number;

  @Column()
  chatId: string;

  @Column()
  buyinNickname: string;

  @Column()
  status: number;

  @Column()
  productIndex: number;

  @Column()
  num: number;

  @Column({ nullable: true })
  endMinutes: number;

  @Column()
  messageId: string;
}
