import { IsNotEmpty, Min } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CarEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @Column()
  brand: string;

  @IsNotEmpty()
  @Column()
  modelName: string;

  @Min(0)
  @Column({
    type: 'int',
  })
  stock: number;
}
