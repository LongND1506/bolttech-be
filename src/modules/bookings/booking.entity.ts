import { IsDate, IsEmail, IsNotEmpty, IsUUID } from 'class-validator';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CarEntity } from '../cars';

@Entity()
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @Column()
  @IsUUID()
  @OneToOne(() => CarEntity, (car) => car.id)
  carId: string;

  @IsNotEmpty()
  @IsEmail()
  @Column()
  email: string;

  @IsNotEmpty()
  @Column()
  drivingLicense: string;

  @IsNotEmpty()
  @Column()
  drivingLicenseExpiry: Date;

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
