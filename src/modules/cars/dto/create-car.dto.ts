import { CreatePricingDto } from '@/modules/pricing/dto';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateCarDto {
  @ApiProperty()
  @IsNotEmpty()
  brand: string;

  @ApiProperty()
  @IsNotEmpty()
  modelName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Min(0)
  stock: number;

  @ApiProperty({
    type: [CreatePricingDto],
    default: [],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreatePricingDto)
  pricings: CreatePricingDto[];
}

export class CreateCarResponseDto {
  @ApiResponseProperty()
  id: string;
}
