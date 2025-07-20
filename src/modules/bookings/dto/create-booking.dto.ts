import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';
import { parseISO } from 'date-fns';
import { IsAfterStartDate, IsAfterToday } from '../validators';

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  carId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @Transform((field) => parseISO(field.value as string).toISOString())
  @Validate(IsAfterToday, {
    message: 'Start Date must be after today',
  })
  startDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @Transform((field) => new Date(field.value as string).toISOString())
  @Validate(IsAfterStartDate, {
    message: 'End Date must be after or equal Start Date',
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
