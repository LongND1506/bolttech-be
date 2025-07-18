import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UserDto } from './dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers(): Promise<UserDto[]> {
    const users = await this._userRepository.find();

    return users?.map((user) => new UserDto(user));
  }

  async getUserById(id: string): Promise<UserDto> {
    const user = await this._userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');

    return new UserDto(user);
  }

  async createUser(payload: CreateUserDto): Promise<UserDto> {
    try {
      const newUser = this._userRepository.create(payload);
      await this._userRepository.insert(newUser);

      return new UserDto(newUser);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
