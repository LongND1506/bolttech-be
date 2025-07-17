import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class CarsQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty()
  @IsOptional()
  isAvailable?: boolean;
}

export class CarDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  brand: string;

  @ApiResponseProperty()
  modelName: string;

  @ApiResponseProperty()
  stock: number;

  @ApiResponseProperty()
  averagePricePerDay: number;

  @ApiResponseProperty()
  totalPrice: number;

  constructor(payload?: CarDto) {
    this.id = payload?.id || '';
    this.brand = payload?.brand || '';
    this.modelName = payload?.modelName || '';
    this.stock = payload?.stock || 0;
    this.averagePricePerDay = payload?.averagePricePerDay || 0;
    this.totalPrice = payload?.totalPrice || 0;
  }
}
