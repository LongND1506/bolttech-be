import { Test, TestingModule } from '@nestjs/testing';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import {
  CarDto,
  CarsQueryDto,
  CreateCarDto,
  CreateCarResponseDto,
} from './dto';
import { JwtService } from '@nestjs/jwt';

describe('CarController', () => {
  let controller: CarController;
  let carService: jest.Mocked<CarService>;

  const mockCarService = {
    getCars: jest.fn(),
    createCar: jest.fn(),
  } as unknown as jest.Mocked<CarService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarController],
      providers: [
        { provide: CarService, useValue: mockCarService },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), verify: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<CarController>(CarController);
    carService = module.get(CarService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCars', () => {
    it('should return an array of CarDto', async () => {
      const query: CarsQueryDto = {
        startDate: '2024-01-01',
        endDate: '2024-01-10',
      } as any;
      const cars: CarDto[] = [
        {
          id: '1',
          brand: 'Toyota',
          modelName: 'Corolla',
          stock: 2,
          averagePricePerDay: 50,
          totalPrice: 500,
        } as CarDto,
      ];
      carService.getCars.mockResolvedValue(cars);

      const result = await controller.getCars(query);
      expect(result).toBe(cars);
      expect(carService.getCars).toHaveBeenCalledWith(query);
    });
  });

  describe('createCar', () => {
    it('should create a car and return CreateCarResponseDto', async () => {
      const payload: CreateCarDto = {
        brand: 'Honda',
        modelName: 'Civic',
        stock: 3,
      } as any;
      const response: CreateCarResponseDto = { id: '123' } as any;
      carService.createCar.mockResolvedValue(response);

      const result = await controller.createCar(payload);
      expect(result).toBe(response);
      expect(carService.createCar).toHaveBeenCalledWith(payload);
    });
  });
});
