import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { CreateBookingDto, CreateBookingResponseDto, BookingDto } from './dto';

describe('BookingController', () => {
  let controller: BookingController;
  let bookingService: jest.Mocked<BookingService>;

  beforeEach(async () => {
    const mockBookingService = {
      createBooking: jest.fn(),
      getAllBookings: jest.fn(),
      getBookingById: jest.fn(),
    } as unknown as jest.Mocked<BookingService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: BookingService,
          useValue: mockBookingService,
        },
      ],
    }).compile();

    controller = module.get<BookingController>(BookingController);
    bookingService = module.get(BookingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createBooking', () => {
    it('should call service and return CreateBookingResponseDto', async () => {
      const dto: CreateBookingDto = {
        carId: 'car-1',
        email: 'test@example.com',
        drivingLicense: 'DL123',
        drivingLicenseExpiry: '2024-12-31',
        startDate: '2024-06-01',
        endDate: '2024-06-10',
      };
      const response = new CreateBookingResponseDto('booking-1');
      bookingService.createBooking.mockResolvedValue(response);
      await expect(controller.createBooking(dto)).resolves.toEqual(response);
      expect(bookingService.createBooking).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllBookings', () => {
    it('should return an array of BookingDto', async () => {
      const bookings = [
        new BookingDto({
          id: 'booking-1',
          carId: 'car-1',
          email: 'test@example.com',
          drivingLicense: 'DL123',
          drivingLicenseExpiry: new Date('2024-12-31'),
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-10'),
          totalPrice: 1000,
        } as any),
      ];
      bookingService.getAllBookings.mockResolvedValue(bookings);
      await expect(controller.getAllBookings()).resolves.toEqual(bookings);
      expect(bookingService.getAllBookings).toHaveBeenCalled();
    });
  });

  describe('getBookingById', () => {
    it('should return a BookingDto', async () => {
      const booking = new BookingDto({
        id: 'booking-1',
        carId: 'car-1',
        email: 'test@example.com',
        drivingLicense: 'DL123',
        drivingLicenseExpiry: new Date('2024-12-31'),
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-10'),
        totalPrice: 1000,
      } as any);
      bookingService.getBookingById.mockResolvedValue(booking);
      await expect(controller.getBookingById('booking-1')).resolves.toEqual(booking);
      expect(bookingService.getBookingById).toHaveBeenCalledWith('booking-1');
    });
  });
});
