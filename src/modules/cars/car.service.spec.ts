import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PricingService } from '../pricing/pricing.service';
import { CarEntity } from './car.entity';
import { CarService } from './car.service';
import { CarsQueryDto, CreateCarDto } from './dto';

const mockCarRepository = () => ({
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockPricingService = () => ({
  getAveragePricePerDay: jest.fn(),
  getTotalPrice: jest.fn(),
  createNewPricing: jest.fn(),
});

describe('CarService', () => {
  let service: CarService;
  let carRepository: ReturnType<typeof mockCarRepository>;
  let pricingService: ReturnType<typeof mockPricingService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        {
          provide: getRepositoryToken(CarEntity),
          useFactory: mockCarRepository,
        },
        { provide: PricingService, useFactory: mockPricingService },
      ],
    }).compile();

    service = module.get<CarService>(CarService);
    carRepository = module.get(getRepositoryToken(CarEntity));
    pricingService = module.get(PricingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCars', () => {
    it('should return cars with zero pricing if no dates provided', async () => {
      const cars = [
        { id: '1', brand: 'Toyota', modelName: 'Corolla', stock: 2 },
      ];
      carRepository.find.mockResolvedValue(cars);
      const payload: CarsQueryDto = {} as any;
      const result = await service.getCars(payload);
      expect(result[0]).toMatchObject({
        id: '1',
        brand: 'Toyota',
        modelName: 'Corolla',
        stock: 2,
        averagePricePerDay: 0,
        totalPrice: 0,
      });
      expect(carRepository.find).toHaveBeenCalled();
    });

    it('should return cars with calculated pricing if dates provided', async () => {
      const cars = [
        { id: '1', brand: 'Toyota', modelName: 'Corolla', stock: 2 },
      ];
      carRepository.find.mockResolvedValue(cars);
      const payload: CarsQueryDto = {
        startDate: '2024-01-01',
        endDate: '2024-01-10',
      } as any;
      // Simulate availableCars
      carRepository.find.mockResolvedValueOnce(cars);
      pricingService.getAveragePricePerDay.mockResolvedValue(50);
      pricingService.getTotalPrice.mockResolvedValue(500);
      const result = await service.getCars(payload);
      expect(result[0]).toMatchObject({
        id: '1',
        brand: 'Toyota',
        modelName: 'Corolla',
        stock: 2,
        averagePricePerDay: 50,
        totalPrice: 500,
      });
      expect(carRepository.find).toHaveBeenCalled();
      expect(pricingService.getAveragePricePerDay).toHaveBeenCalled();
      expect(pricingService.getTotalPrice).toHaveBeenCalled();
    });
  });

  describe('createCar', () => {
    it('should create a car and pricing and return id', async () => {
      const payload: CreateCarDto = {
        brand: 'Honda',
        modelName: 'Civic',
        stock: 3,
        pricings: [{ season: 'SUMMER', pricePerDay: 100 }],
      } as any;
      const savedCar = { id: '123', ...payload };
      carRepository.create.mockReturnValue(payload);
      carRepository.save.mockResolvedValue(savedCar);
      pricingService.createNewPricing.mockResolvedValue(undefined);
      const result = await service.createCar(payload);
      expect(result).toEqual({ id: '123' });
      expect(carRepository.create).toHaveBeenCalledWith({
        brand: 'Honda',
        modelName: 'Civic',
        stock: 3,
      });
      expect(carRepository.save).toHaveBeenCalled();
      expect(pricingService.createNewPricing).toHaveBeenCalled();
    });
  });
});
