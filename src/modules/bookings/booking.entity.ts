import { IsDate, IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CarEntity } from '../cars/car.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => CarEntity, (car) => car.id)
  @JoinColumn({
    name: 'car_id',
    referencedColumnName: 'id',
  })
  car: CarEntity;

  @IsNotEmpty()
  @OneToOne(() => UserEntity, (user) => user.id)
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
  })
  totalPrice: number;
}
