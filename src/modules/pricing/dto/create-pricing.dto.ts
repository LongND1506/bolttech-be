import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Season } from '../season.enum';
import { CarDto } from '@/modules/cars/dto';

export class CreatePricingDto {
  @ApiProperty({
    enum: Season,
  })
  @IsNotEmpty()
  @IsEnum(Season)
  season: Season;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  car?: Partial<CarDto>;
}
