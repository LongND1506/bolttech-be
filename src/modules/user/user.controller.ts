import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    type: [UserDto],
    status: 200,
    isArray: true,
  })
  @Get()
  getAllUsers(): Promise<UserDto[]> {
    return this._userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    type: UserDto,
    status: 200,
  })
  @Get(':id')
  getUserById(@Param('id') id: string): Promise<UserDto> {
    return this._userService.getUserById(id);
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    type: UserDto,
    status: 200,
  })
  @Post()
  createUser(@Body() payload: UserDto): Promise<UserDto> {
    return this._userService.createUser(payload);
  }
}
