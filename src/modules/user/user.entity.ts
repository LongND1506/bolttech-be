import * as bcrypt from 'bcrypt';
import { IsDate, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookingEntity } from '../bookings/booking.entity';
import { UserRole } from './enums';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNotEmpty()
  @IsEmail()
  @Column({
    unique: true,
  })
  email: string;

  @IsNotEmpty()
  @Column()
  password: string;

  @IsNotEmpty()
  @Column()
  drivingLicense: string;

  @IsNotEmpty()
  @IsDate()
  @Column()
  drivingLicenseExpiry: Date;

  @IsNotEmpty()
  @IsEnum(UserRole)
  @Column({
    default: UserRole.User,
  })
  role: UserRole;

  @OneToMany(() => BookingEntity, (booking) => booking.user)
  bookings: BookingEntity[];

  @BeforeInsert()
  async hasPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
