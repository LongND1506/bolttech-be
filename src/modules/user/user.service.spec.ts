import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto, UserDto } from './dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

const mockUserRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  insert: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let userRepository: ReturnType<typeof mockUserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return mapped users', async () => {
      const users = [{ id: 'u1' }];
      userRepository.find.mockResolvedValue(users);
      const result = await service.getAllUsers();
      expect(result[0]).toBeInstanceOf(UserDto);
      expect(userRepository.find).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      userRepository.findOneBy.mockResolvedValue({ id: 'u1' });
      const result = await service.getUserById('u1');
      expect(result).toBeInstanceOf(UserDto);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 'u1' });
    });

    it('should throw NotFoundException if not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);
      await expect(service.getUserById('u1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createUser', () => {
    it('should create and insert user, then return UserDto', async () => {
      const payload: CreateUserDto = { id: 'u1', name: 'Test' } as any;
      const newUser = { id: 'u1', name: 'Test' };
      userRepository.create.mockReturnValue(newUser);
      userRepository.insert.mockResolvedValue(undefined);

      const result = await service.createUser(payload);
      expect(result).toBeInstanceOf(UserDto);
      expect(userRepository.create).toHaveBeenCalledWith(payload);
      expect(userRepository.insert).toHaveBeenCalledWith(newUser);
    });

    it('should throw InternalServerErrorException on error', async () => {
      userRepository.create.mockImplementation(() => {
        throw new Error('fail');
      });
      await expect(service.createUser({} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
