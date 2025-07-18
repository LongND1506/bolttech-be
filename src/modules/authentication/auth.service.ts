import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto, CurrentUserDto, UserDto, UserEntity } from '../user';
import { SignInDto, SignInResponseDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    private readonly _jwtService: JwtService,
  ) {}

  async signUp(payload: CreateUserDto): Promise<UserDto> {
    const user = await this._userRepository.findOneBy({
      email: payload.email,
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const newUser = this._userRepository.create(payload);
    await this._userRepository.insert(newUser);

    return new UserDto(newUser);
  }

  async signIn(payload: SignInDto): Promise<SignInResponseDto> {
    const user = await this._userRepository.findOneBy({
      email: payload.email,
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = bcrypt.compareSync(payload.password, user.password);

    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const accessToken = this._jwtService.sign(user);

    return {
      accessToken,
    };
  }

  async getUserProfile(authHeader: string): Promise<CurrentUserDto> {
    const token = authHeader.split(' ')[1];
    const data = this._jwtService.decode(token);
    const user = await this._userRepository.findOneBy({ email: data.email });

    if (!user) throw new NotFoundException('User not found');

    return new CurrentUserDto(user);
  }
}
