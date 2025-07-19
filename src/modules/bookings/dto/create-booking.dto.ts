import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  MinDate,
  Validate,
} from 'class-validator';
import { getTomorrowDate } from 'src/shared';
import { IsAfterStartDate } from '../validators';

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  carId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @Transform((field) => new Date(field.value as string))
  @MinDate(getTomorrowDate(), {
    message: 'startDate must be at least tomorrow',
  })
  startDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @Transform(({ value }: { value: string }): Date => new Date(value))
  @Validate(IsAfterStartDate, {
    message: 'endDate must be after startDate',
  })
  endDate: string;
}

export class CreateBookingResponseDto {
  @ApiResponseProperty()
  id: string;

  constructor(_id: string) {
    this.id = _id;
  }
}
