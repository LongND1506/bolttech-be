import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from './booking.entity';
import { BookingService } from './booking.service';
import { CarEntity } from '../cars/car.entity';
import { PricingModule } from '../pricing/pricing.module';
import { UserEntity } from '../user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity, CarEntity, UserEntity]),
    PricingModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
