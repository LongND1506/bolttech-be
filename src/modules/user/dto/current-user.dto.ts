import { ApiResponseProperty } from '@nestjs/swagger';
import { Permission } from '../enums';
import { UserDto } from './user.dto';
import { UserEntity } from '../user.entity';
import { ROLE_PERMISSION_MAPPER } from '../constants';

export class CurrentUserDto extends UserDto {
  @ApiResponseProperty({
    enum: Permission,
    type: 'array',
  })
  permissions: Permission[] | undefined;

  constructor(userEntity: UserEntity) {
    super(userEntity);
    this.permissions = ROLE_PERMISSION_MAPPER.get(userEntity.role);
  }
}
