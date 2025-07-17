import { PricingEntity } from '../pricing';
import { Type } from 'class-transformer';
import { IsNotEmpty, Min, ValidateNested } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @ValidateNested({ each: true })
  @Type(() => PricingEntity)
  @OneToMany(() => PricingEntity, (pricing) => pricing.car)
  prices: PricingEntity[];
}
