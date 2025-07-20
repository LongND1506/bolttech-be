import { InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CarEntity } from '../cars/car.entity';
import { PricingService } from '../pricing/pricing.service';
import { UserDto } from '../user/dto';
import { BookingEntity } from './booking.entity';
import { BookingService } from './booking.service';
import { BookingDto, CreateBookingDto, CreateBookingResponseDto } from './dto';

const mockBookingRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(),
});

const mockCarRepository = () => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
});

const mockPricingService = () => ({
  getTotalPrice: jest.fn(),
});

describe('BookingService', () => {
  let service: BookingService;
  let bookingRepository: ReturnType<typeof mockBookingRepository>;
  let carRepository: ReturnType<typeof mockCarRepository>;
  let pricingService: ReturnType<typeof mockPricingService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(BookingEntity),
          useFactory: mockBookingRepository,
        },
        {
          provide: getRepositoryToken(CarEntity),
          useFactory: mockCarRepository,
        },
        { provide: PricingService, useFactory: mockPricingService },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), verify: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    bookingRepository = module.get(getRepositoryToken(BookingEntity));
    carRepository = module.get(getRepositoryToken(CarEntity));
    pricingService = module.get(PricingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    const user: UserDto = {
      id: 'user1',
      drivingLicenseExpiry: '2099-12-31',
    } as any;
    const car = { id: 'car1', stock: 2 };
    const payload: CreateBookingDto = {
      carId: 'someCarId',
      startDate: '2024-01-01',
      endDate: '2024-01-02',
      userId: 'someUserId', // <-- Add this line
    };

    it('should create booking and update car stock', async () => {
      carRepository.findOneBy.mockResolvedValue(car);
      jest
        .spyOn(service, 'checkUserValidDrivingLicense' as any)
        .mockReturnValue(true);
      jest.spyOn(service, 'checkIsOverlap').mockResolvedValue(false);
      pricingService.getTotalPrice.mockResolvedValue(1000);
      bookingRepository.create.mockReturnValue({ id: 'booking1' });
      bookingRepository.save.mockResolvedValue({ id: 'booking1' });
      carRepository.save.mockResolvedValue({ ...car, stock: 1 });

      const result = await service.createBooking(payload, user);
      expect(result).toBeInstanceOf(CreateBookingResponseDto);
      expect(result.id).toBe('booking1');
      expect(carRepository.save).toHaveBeenCalledWith({
        ...car,
        stock: car.stock - 1,
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      carRepository.findOneBy.mockRejectedValue(new Error('fail'));
      await expect(service.createBooking(payload, user)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getAllBookings', () => {
    it('should return mapped bookings', async () => {
      const bookings = [{ id: 'b1' }];
      bookingRepository.find.mockResolvedValue(bookings);
      const result = await service.getAllBookings();
      expect(result[0]).toBeInstanceOf(BookingDto);
      expect(bookingRepository.find).toHaveBeenCalled();
    });
  });
});
