import { ApiResponseProperty } from '@nestjs/swagger';
import { UserRole } from '../enums';
import { UserEntity } from '../user.entity';

export class UserDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  role: UserRole;

  @ApiResponseProperty()
  drivingLicense: string;

  @ApiResponseProperty()
  drivingLicenseExpiry: string;

  constructor(entity: UserEntity) {
    console.log(entity);
    this.id = entity.id;
    this.email = entity.email;
    this.role = entity.role;
    this.drivingLicense = entity.drivingLicense;
    this.drivingLicenseExpiry = entity.drivingLicenseExpiry.toISOString();
  }
}
