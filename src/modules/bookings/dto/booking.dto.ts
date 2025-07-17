import { PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';
import { BookingEntity } from '../booking.entity';

export class BookingDto extends PartialType(CreateBookingDto) {
  id: string;
  totalPrice: number;

  constructor(entity: BookingEntity) {
    super();
    this.id = entity.id;
    this.email = entity.email;
    this.drivingLicense = entity.drivingLicense;
    this.drivingLicenseExpiry = entity.drivingLicenseExpiry.toISOString();
    this.startDate = entity.startDate.toISOString();
    this.endDate = entity.endDate.toISOString();
    this.totalPrice = entity.totalPrice;
  }
}
