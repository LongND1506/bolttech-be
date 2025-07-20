import { IsEnum, IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CarEntity } from '../cars/car.entity';
import { Season } from './season.enum';

@Entity()
export class PricingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @IsEnum(Season)
  @Column()
  season: Season;

  @IsNotEmpty()
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    transformer: {
      from: (value: string) => parseFloat(value),
      to: (value: number) => value,
    },
  })
  price: number;

  @ManyToOne(() => CarEntity, (car: CarEntity) => car.pricings)
  @JoinColumn({
    name: 'card_id',
    referencedColumnName: 'id',
  })
  car: CarEntity;
}
