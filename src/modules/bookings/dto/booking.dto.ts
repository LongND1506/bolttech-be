import { ApiResponseProperty } from '@nestjs/swagger';
import { CarDto } from '../../cars/dto';
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

  @ApiResponseProperty({
    type: CarDto,
  })
  car?: Partial<CarDto>;

  constructor(entity: BookingEntity) {
    this.id = entity.id;
    this.startDate = entity.startDate?.toISOString();
    this.endDate = entity.endDate?.toISOString();
    this.totalPrice = entity.totalPrice;
    this.car = entity.car
      ? {
          id: entity.car.id,
          brand: entity.car.brand,
          modelName: entity.car.modelName,
          stock: entity.car.stock,
        }
      : undefined;
  }
}
