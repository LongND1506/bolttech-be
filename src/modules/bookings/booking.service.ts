import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarEntity } from '../cars/car.entity';
import { PricingService } from '../pricing/pricing.service';
import { UserDto } from '../user/dto';
import { BookingEntity } from './booking.entity';
import { BookingDto, CreateBookingDto, CreateBookingResponseDto } from './dto';
import { parseISO } from 'date-fns';

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

      if (!this.checkUserValidDrivingLicense(userDto, [start, end]))
        throw new BadRequestException(
          'User does not have valid driving license',
        );

      if (await this.checkIsOverlap(userDto.id, start, end))
        throw new BadRequestException('Booking is overlap');

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

      if (result.id) {
        await this._carRepository.save({
          ...car,
          stock: car.stock - 1,
        });
      }

      return new CreateBookingResponseDto(result.id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllBookings(): Promise<BookingDto[]> {
    const bookings = await this._bookingRepository.find();

    return bookings.map((booking) => new BookingDto(booking));
  }

  async getUserBookingsHistory(userId: string): Promise<BookingDto[]> {
    const bookings = await this._bookingRepository.find({
      relations: {
        user: true,
        car: true,
      },
      where: { user: { id: userId } },
    });

    return bookings.map((booking) => new BookingDto(booking));
  }

  async getBookingById(id: string): Promise<BookingDto> {
    const booking = await this._bookingRepository.findOneBy({ id });

    if (!booking) throw new NotFoundException('Booking not found');

    return new BookingDto(booking);
  }

  async checkIsOverlap(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    const overlap = await this._bookingRepository
      .createQueryBuilder('booking')
      .where('booking.user_Id = :userId', { userId })
      .andWhere('booking.startDate <= :endDate', { endDate })
      .andWhere('booking.endDate >= :startDate', { startDate })
      .getOne();

    return !!overlap;
  }

  private checkUserValidDrivingLicense(
    user: UserDto,
    dateRange: Date[],
  ): boolean {
    const drivingLicenseExpiry = parseISO(user.drivingLicenseExpiry);
    return drivingLicenseExpiry >= dateRange[1];
  }
}
