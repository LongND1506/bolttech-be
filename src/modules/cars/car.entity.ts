import { IsNotEmpty, Min } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BookingEntity } from '../bookings/booking.entity';
import { PricingEntity } from '../pricing/pricing.entity';

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

  @OneToMany(() => PricingEntity, (pricing) => pricing.car)
  pricings: PricingEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.car)
  bookings: BookingEntity[];
}
