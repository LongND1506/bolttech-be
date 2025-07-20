import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import {
  DRIVING_LICENSE_MAX_LENGTH,
  DRIVING_LICENSE_MIN_LENGTH,
  DRIVING_LICENSE_REGEX,
} from '../../../shared/constants';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(DRIVING_LICENSE_REGEX, { message: 'Invalid driving license' })
  @Length(DRIVING_LICENSE_MIN_LENGTH, DRIVING_LICENSE_MAX_LENGTH, {
    always: true,
    message: 'Invalid driving license',
  })
  @ApiProperty()
  drivingLicense: string;

  @ApiProperty()
  @IsNotEmpty()
  drivingLicenseExpiry: string;
}
