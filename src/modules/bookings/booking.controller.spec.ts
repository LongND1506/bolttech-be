import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingDto, CreateBookingDto, CreateBookingResponseDto } from './dto';
import { UserDto } from '../user/dto';
import { JwtService } from '@nestjs/jwt';

describe('BookingController', () => {
  let controller: BookingController;
  let bookingService: jest.Mocked<BookingService>;

  const mockBookingService = {
    getUserBookingsHistory: jest.fn(),
    getAllBookings: jest.fn(),
    getBookingById: jest.fn(),
    createBooking: jest.fn(),
  } as unknown as jest.Mocked<BookingService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        { provide: BookingService, useValue: mockBookingService },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), verify: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<BookingController>(BookingController);
    bookingService = module.get(BookingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserBookingsHistory', () => {
    it('should return user bookings history', async () => {
      const user: UserDto = { id: 'user1' } as any;
      const bookings: BookingDto[] = [{ id: 'b1' } as BookingDto];
      bookingService.getUserBookingsHistory.mockResolvedValue(bookings);
      const result = await controller.getUserBookingsHistory(user);
      expect(result).toBe(bookings);
      expect(bookingService.getUserBookingsHistory).toHaveBeenCalledWith(
        'user1',
      );
    });
  });

  describe('getAllBookings', () => {
    it('should return all bookings', async () => {
      const bookings: BookingDto[] = [{ id: 'b1' } as BookingDto];
      bookingService.getAllBookings.mockResolvedValue(bookings);
      const result = await controller.getAllBookings();
      expect(result).toBe(bookings);
      expect(bookingService.getAllBookings).toHaveBeenCalled();
    });
  });

  describe('getBookingById', () => {
    it('should return booking by id', async () => {
      const booking: BookingDto = { id: 'b1' } as BookingDto;
      bookingService.getBookingById.mockResolvedValue(booking);
      const result = await controller.getBookingById('b1');
      expect(result).toBe(booking);
      expect(bookingService.getBookingById).toHaveBeenCalledWith('b1');
    });
  });

  describe('createBooking', () => {
    it('should create a booking and return response', async () => {
      const payload: CreateBookingDto = {
        carId: 'c1',
        startDate: '2024-01-01',
        endDate: '2024-01-02',
      } as any;
      const user: UserDto = { id: 'user1' } as any;
      const response: CreateBookingResponseDto = { id: 'booking1' } as any;
      bookingService.createBooking.mockResolvedValue(response);
      const result = await controller.createBooking(payload, user);
      expect(result).toBe(response);
      expect(bookingService.createBooking).toHaveBeenCalledWith(payload, user);
    });
  });
});
