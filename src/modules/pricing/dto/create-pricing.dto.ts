import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Season } from '../season.enum';

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

  @ApiProperty()
  @IsNotEmpty()
  carId: string;
}
