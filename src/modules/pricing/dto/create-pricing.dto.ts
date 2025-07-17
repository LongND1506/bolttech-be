import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Season } from '../season.enum';

export class CreatePricingDto {
  @ApiProperty({
    enum: Season,
  })
  @IsNotEmpty()
  @IsEnum(Season)
  pricingName: Season;

  @ApiProperty()
  @IsNotEmpty()
  value: number;

  @ApiProperty()
  @IsNotEmpty()
  carId: string;
}
