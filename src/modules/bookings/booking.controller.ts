import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { BookingDto, CreateBookingDto, CreateBookingResponseDto } from './dto';
import { AuthGuard } from '../authentication/auth.guard';
import { User } from '../user/user.decorator';
import { UserDto } from '../user/dto';

@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly _bookingService: BookingService) {}

  @ApiOperation({ summary: 'Create Booking' })
  @ApiResponse({
    type: CreateBookingResponseDto,
    status: 200,
  })
  @UseGuards(AuthGuard)
  @Post()
  createBooking(
    @Body() payload: CreateBookingDto,
    @User() user: UserDto,
  ): Promise<CreateBookingResponseDto> {
    return this._bookingService.createBooking(payload, user);
  }

  @ApiOperation({ summary: 'Get All Bookings' })
  @ApiResponse({
    type: BookingDto,
    status: 200,
    isArray: true,
  })
  @UseGuards(AuthGuard)
  @Get()
  getAllBookings(): Promise<BookingDto[]> {
    return this._bookingService.getAllBookings();
  }

  @ApiOperation({ summary: 'Get Booking By Id' })
  @ApiResponse({
    type: BookingDto,
    status: 200,
  })
  @UseGuards(AuthGuard)
  @Get(':id')
  getBookingById(@Param('id') id: string): Promise<BookingDto> {
    return this._bookingService.getBookingById(id);
  }
}
