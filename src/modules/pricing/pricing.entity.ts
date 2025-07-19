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
  })
  price: number;

  @ManyToOne(() => CarEntity)
  @JoinColumn({
    name: 'card_id',
    referencedColumnName: 'id',
  })
  car: CarEntity;
}
