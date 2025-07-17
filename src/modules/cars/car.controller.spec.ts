import { Test, TestingModule } from '@nestjs/testing';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { CarsQueryDto, CarDto } from './dto';

describe('CarController', () => {
  let controller: CarController;
  let carService: jest.Mocked<CarService>;

  beforeEach(async () => {
    const mockCarService = {
      getCars: jest.fn(),
    } as unknown as jest.Mocked<CarService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarController],
      providers: [
        {
          provide: CarService,
          useValue: mockCarService,
        },
      ],
    }).compile();

    controller = module.get<CarController>(CarController);
    carService = module.get(CarService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCars', () => {
    it('should return an array of CarDto (no query)', async () => {
      const result: CarDto[] = [
        new CarDto({
          id: '1',
          brand: 'Toyota',
          modelName: 'Yaris',
          stock: 3,
          averagePricePerDay: 0,
          totalPrice: 0,
        }),
      ];
      carService.getCars.mockResolvedValue(result);
      const query: CarsQueryDto = {};
      await expect(controller.getCars(query)).resolves.toEqual(result);
    });

    it('should return an array of CarDto (with query)', async () => {
      const result: CarDto[] = [
        new CarDto({
          id: '2',
          brand: 'Toyota',
          modelName: 'Yaris',
          stock: 2,
          averagePricePerDay: 98.43,
          totalPrice: 492.15,
        }),
      ];
      const query: CarsQueryDto = {
        startDate: '2024-06-01',
        endDate: '2024-06-05',
      };
      carService.getCars.mockResolvedValue(result);
      await expect(controller.getCars(query)).resolves.toEqual(result);
    });
  });
});
