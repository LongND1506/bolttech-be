import { Test, TestingModule } from '@nestjs/testing';
import { UserDto } from './dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  const mockUserService = {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
  } as unknown as jest.Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), verify: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users: UserDto[] = [{ id: 'u1' } as UserDto];
      userService.getAllUsers.mockResolvedValue(users);
      const result = await controller.getAllUsers();
      expect(result).toBe(users);
      expect(userService.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const user: UserDto = { id: 'u1' } as UserDto;
      userService.getUserById.mockResolvedValue(user);
      const result = await controller.getUserById('u1');
      expect(result).toBe(user);
      expect(userService.getUserById).toHaveBeenCalledWith('u1');
    });
  });
});
