import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CarService } from './car.service';
import { CarEntity } from './car.entity';
import { PricingService } from '../pricing/pricing.service';
import { CarsQueryDto, CarDto } from './dto';
import { Repository } from 'typeorm';
import { PricingEntity } from '../pricing/pricing.entity';
import { Season } from '../pricing/season.enum';

describe('CarService', () => {
  let service: CarService;
  let carRepository: jest.Mocked<Repository<CarEntity>>;
  let pricingService: jest.Mocked<PricingService>;

  beforeEach(async () => {
    const mockCarRepository = {
      find: jest.fn(),
    } as unknown as jest.Mocked<Repository<CarEntity>>;
    const mockPricingService = {
      getAveragePricePerDay: jest.fn(),
      getTotalPrice: jest.fn(),
    } as unknown as jest.Mocked<PricingService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        { provide: getRepositoryToken(CarEntity), useValue: mockCarRepository },
        { provide: PricingService, useValue: mockPricingService },
      ],
    }).compile();

    service = module.get<CarService>(CarService);
    carRepository = module.get(getRepositoryToken(CarEntity));
    pricingService = module.get(PricingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return cars with 0 prices if no dates are provided', async () => {
    const cars: CarEntity[] = [
      {
        id: '1',
        brand: 'Toyota',
        modelName: 'Yaris',
        stock: 2,
        prices: [],
      },
    ];
    carRepository.find.mockResolvedValue(cars);
    const query: CarsQueryDto = {};
    const result = await service.getCars(query);
    expect(result).toEqual([
      new CarDto({
        id: '1',
        brand: 'Toyota',
        modelName: 'Yaris',
        stock: 2,
        averagePricePerDay: 0,
        totalPrice: 0,
      }),
    ]);

    expect(pricingService.getAveragePricePerDay).not.toHaveBeenCalled();
    expect(pricingService.getTotalPrice).not.toHaveBeenCalled();
  });

  it('should return cars with calculated prices if dates are provided', async () => {
    const prices: PricingEntity[] = [
      {
        pricingName: Season.Peak,
        value: 100,
        car: undefined as unknown as CarEntity,
      },
    ];
    const cars: CarEntity[] = [
      {
        id: '2',
        brand: 'Honda',
        modelName: 'Civic',
        stock: 1,
        prices,
      },
    ];
    carRepository.find.mockResolvedValue(cars);
    pricingService.getAveragePricePerDay.mockReturnValue(50);
    pricingService.getTotalPrice.mockReturnValue(200);
    const query: CarsQueryDto = {
      startDate: '2024-06-01',
      endDate: '2024-06-05',
    };
    const result = await service.getCars(query);
    expect(pricingService.getAveragePricePerDay).toHaveBeenCalled();
    expect(pricingService.getTotalPrice).toHaveBeenCalled();
    expect(result).toEqual([
      new CarDto({
        id: '2',
        brand: 'Honda',
        modelName: 'Civic',
        stock: 1,
        averagePricePerDay: 50,
        totalPrice: 200,
      }),
    ]);
  });

  it('should return an empty array if no cars are found', async () => {
    carRepository.find.mockResolvedValue([]);
    const query: CarsQueryDto = {};
    const result = await service.getCars(query);
    expect(result).toEqual([]);
  });
});
