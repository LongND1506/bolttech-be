import { ApiResponseProperty } from '@nestjs/swagger';
import { BookingEntity } from '../booking.entity';

export class BookingDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  totalPrice: number;

  @ApiResponseProperty()
  startDate: string;

  @ApiResponseProperty()
  endDate: string;

  constructor(entity: BookingEntity) {
    this.id = entity.id;
    this.startDate = entity.startDate.toISOString();
    this.endDate = entity.endDate.toISOString();
    this.totalPrice = entity.totalPrice;
  }
}
