import { IsDate, IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CarEntity } from '../cars/car.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CarEntity, (car) => car.bookings)
  @JoinColumn({
    name: 'car_id',
    referencedColumnName: 'id',
  })
  car: CarEntity;

  @ManyToOne(() => UserEntity, (user) => user.bookings)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: UserEntity;

  @IsNotEmpty()
  @IsDate()
  @Column()
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Column()
  endDate: Date;

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
  totalPrice: number;
}
