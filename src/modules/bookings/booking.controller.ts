import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { BookingDto, CreateBookingDto, CreateBookingResponseDto } from './dto';

@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly _bookingService: BookingService) {}

  @ApiOperation({ summary: 'Create Booking' })
  @ApiResponse({
    type: CreateBookingResponseDto,
    status: 200,
  })
  @Post()
  createBooking(
    @Body() payload: CreateBookingDto,
  ): Promise<CreateBookingResponseDto> {
    return this._bookingService.createBooking(payload);
  }

  @ApiOperation({ summary: 'Get All Bookings' })
  @ApiResponse({
    type: CreateBookingResponseDto,
    status: 200,
    isArray: true,
  })
  @Get()
  getAllBookings(): Promise<BookingDto[]> {
    return this._bookingService.getAllBookings();
  }

  @ApiOperation({ summary: 'Get Booking By Id' })
  @ApiResponse({
    type: CreateBookingResponseDto,
    status: 200,
  })
  @Get(':id')
  getBookingById(@Param() id: string): Promise<BookingDto> {
    return this._bookingService.getBookingById(id);
  }
}
