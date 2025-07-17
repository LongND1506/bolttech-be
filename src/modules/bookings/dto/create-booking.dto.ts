import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinDate,
  Validate,
} from 'class-validator';
import {
  DRIVING_LICENSE_MAX_LENGTH,
  DRIVING_LICENSE_MIN_LENGTH,
  DRIVING_LICENSE_REGEX,
  getTomorrowDate,
} from 'src/shared';
import {
  IsAfterStartDate,
  IsValidDrivingLicenseExpiryValidator,
} from '../validators';

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  carId: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(DRIVING_LICENSE_MIN_LENGTH, DRIVING_LICENSE_MAX_LENGTH)
  @Matches(DRIVING_LICENSE_REGEX, {
    message: 'Invalid driving license',
  })
  @Transform((field) => (field.value as string).trim())
  drivingLicense: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @Validate(IsValidDrivingLicenseExpiryValidator, {
    message: 'Driving license must be valid before endDate',
  })
  drivingLicenseExpiry: string;

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
