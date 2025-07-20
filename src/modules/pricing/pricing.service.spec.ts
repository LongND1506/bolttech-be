import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PricingEntity } from './pricing.entity';
import { PricingService } from './pricing.service';
import { Season } from './season.enum';

const mockPricingRepository = () => ({
  create: jest.fn(),
  insert: jest.fn(),
  findOneBy: jest.fn(),
});

describe('PricingService', () => {
  let service: PricingService;
  let pricingRepository: ReturnType<typeof mockPricingRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricingService,
        {
          provide: getRepositoryToken(PricingEntity),
          useFactory: mockPricingRepository,
        },
      ],
    }).compile();

    service = module.get<PricingService>(PricingService);
    pricingRepository = module.get(getRepositoryToken(PricingEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewPricing', () => {
    it('should create and insert pricing records', async () => {
      const payload = [
        { car: { id: 'car1' }, season: Season.Peak, price: 100 },
      ];
      pricingRepository.create.mockReturnValue(payload);
      pricingRepository.insert.mockResolvedValue(undefined);
      await expect(service.createNewPricing(payload)).resolves.toBeUndefined();
      expect(pricingRepository.create).toHaveBeenCalledWith(payload);
      expect(pricingRepository.insert).toHaveBeenCalledWith(payload);
    });

    it('should throw InternalServerErrorException on error', async () => {
      pricingRepository.create.mockImplementation(() => {
        throw new Error('fail');
      });
      await expect(service.createNewPricing([])).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getTotalPrice', () => {
    it('should sum prices for each day in the interval', async () => {
      const startDate = new Date('2024-06-01');
      const endDate = new Date('2024-06-03');
      pricingRepository.findOneBy.mockResolvedValue({ price: 100 });
      jest.spyOn(service, 'getCurrentSeason').mockReturnValue(Season.Peak);

      const total = await service.getTotalPrice(startDate, endDate, 'car1');
      expect(total).toBe(300);
      expect(pricingRepository.findOneBy).toHaveBeenCalledTimes(3);
    });

    it('should return 0 if no pricing found', async () => {
      const startDate = new Date('2024-06-01');
      const endDate = new Date('2024-06-01');
      pricingRepository.findOneBy.mockResolvedValue(undefined);
      jest.spyOn(service, 'getCurrentSeason').mockReturnValue(Season.Peak);

      const total = await service.getTotalPrice(startDate, endDate, 'car1');
      expect(total).toBe(0);
    });
  });

  describe('getAveragePricePerDay', () => {
    it('should return average price per day', async () => {
      const startDate = new Date('2024-06-01');
      const endDate = new Date('2024-06-03');
      jest.spyOn(service, 'getTotalPrice').mockResolvedValue(300);

      const avg = await service.getAveragePricePerDay(
        startDate,
        endDate,
        'car1',
      );
      // There are 2 days in the interval for average (see service logic)
      expect(avg).toBe(100);
    });

    it('should return 0 if no days in interval', async () => {
      jest.spyOn(service, 'getTotalPrice').mockResolvedValue(0);
      const avg = await service.getAveragePricePerDay(
        new Date('2024-06-01'),
        new Date('2024-06-01'),
        'car1',
      );
      expect(avg).toBe(0);
    });
  });
});
