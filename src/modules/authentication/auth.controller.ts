import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { SignInDto, SignInResponseDto } from './dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto, CurrentUserDto, UserDto } from '../user';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({ status: 200, type: SignInResponseDto })
  @Post('sign-in')
  signIn(@Body() payload: SignInDto): Promise<SignInResponseDto> {
    return this._authService.signIn(payload);
  }

  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({ status: 200, type: UserDto })
  @Post('sign-up')
  signUp(@Body() payload: CreateUserDto): Promise<UserDto> {
    return this._authService.signUp(payload);
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, type: CurrentUserDto })
  @Get('user-profile')
  getUserProfile(
    @Headers('Authorization') authHeader: string,
  ): Promise<CurrentUserDto> {
    return this._authService.getUserProfile(authHeader);
  }
}
