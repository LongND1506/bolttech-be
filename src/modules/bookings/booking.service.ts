import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parseISO } from 'date-fns';
import { Repository } from 'typeorm';
import { BookingEntity } from './booking.entity';
import { BookingDto, CreateBookingDto, CreateBookingResponseDto } from './dto';
import { PricingService } from '../pricing/pricing.service';
import { CarEntity } from '../cars/car.entity';
import { UserDto } from '../user/dto';

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
    userDto: UserDto,
  ): Promise<CreateBookingResponseDto> {
    try {
      const { carId, startDate, endDate } = payload;

      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const car = await this._carRepository.findOneBy({ id: carId });

      if (!car?.stock)
        throw new NotFoundException('Selected Car is not available');

      const totalPrice = await this._pricingService.getTotalPrice(
        start,
        end,
        car.id,
      );
      const record = this._bookingRepository.create({
        car,
        user: userDto,
        startDate: start,
        endDate: end,
        totalPrice,
      });
      const result = await this._bookingRepository.save(record);
      await this._carRepository.update({ id: carId }, { stock: car.stock - 1 });

      return new CreateBookingResponseDto(result.id);
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
