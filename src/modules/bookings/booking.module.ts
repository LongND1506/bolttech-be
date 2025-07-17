import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from './booking.entity';
import { BookingService } from './booking.service';
import { PricingModule } from '../pricing';
import { CarEntity } from '../cars';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity, CarEntity]),
    PricingModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
