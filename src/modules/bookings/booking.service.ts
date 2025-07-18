import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parseISO } from 'date-fns';
import { Repository } from 'typeorm';
import { CarEntity } from '../cars';
import { PricingService } from '../pricing';
import { BookingEntity } from './booking.entity';
import { BookingDto, CreateBookingDto, CreateBookingResponseDto } from './dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly _bookingRepository: Repository<BookingEntity>,
    @InjectRepository(CarEntity)
    private readonly _carRepository: Repository<CarEntity>,
    private readonly _pricingService: PricingService,
  ) {}

  async createBooking(
    payload: CreateBookingDto,
  ): Promise<CreateBookingResponseDto> {
    try {
      const {
        email,
        carId,
        startDate,
        endDate,
        drivingLicense,
        drivingLicenseExpiry,
      } = payload;

      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const expiry = parseISO(drivingLicenseExpiry);
      const car = await this._carRepository.findOneBy({ id: carId });

      if (!car?.stock)
        throw new NotFoundException('Selected Car is not available');

      const totalPrice = this._pricingService.getTotalPrice(
        start,
        end,
        car.prices,
      );
      const record = this._bookingRepository.create({
        carId,
        email,
        drivingLicense,
        startDate: start,
        endDate: end,
        drivingLicenseExpiry: expiry,
        totalPrice,
      });
      const result = await this._bookingRepository.insert(record);
      await this._carRepository.update({ id: carId }, { stock: car.stock - 1 });

      return new CreateBookingResponseDto(result.raw['insertId']);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllBookings(): Promise<BookingDto[]> {
    const bookings = await this._bookingRepository.find();

    return bookings.map((booking) => new BookingDto(booking));
  }

  async getBookingById(id: string): Promise<BookingDto> {
    const booking = await this._bookingRepository.findOneBy({ id });

    if (!booking) throw new NotFoundException('Booking not found');

    return new BookingDto(booking);
  }
}
