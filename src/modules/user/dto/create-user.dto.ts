import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto extends PickType(UserDto, [
  'email',
  'drivingLicense',
  'drivingLicenseExpiry',
]) {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  drivingLicense: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  drivingLicenseExpiry: string;
}
