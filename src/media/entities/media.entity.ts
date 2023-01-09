import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

export enum MediaType {
  PNG = 'image/png',
}

@Entity()
export class Media {
  @PrimaryColumn()
  readonly hash: string;

  @Column()
  readonly url: string;

  @Column()
  readonly name: string;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  readonly mimeType: number;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  readonly create_at: string;

  @Column()
  readonly width: number;

  @Column()
  readonly height: number;

  @Column({
    default: '',
  })
  readonly title: string;

  @Column({
    default: '',
  })
  readonly alt: string;

  @Column({
    default: '',
  })
  readonly description: string;
}
