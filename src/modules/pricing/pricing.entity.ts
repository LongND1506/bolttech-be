import { IsEnum, IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Season } from './season.enum';
import { CarEntity } from '../cars';

@Entity()
export class PricingEntity {
  @IsNotEmpty()
  @IsEnum(Season)
  @PrimaryColumn()
  season: Season;

  @IsNotEmpty()
  @Column({
    type: 'decimal',
  })
  price: number;

  @ManyToOne(() => CarEntity)
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'card_id',
  })
  car: CarEntity;
}
