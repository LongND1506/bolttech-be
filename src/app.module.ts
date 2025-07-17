import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructures';
import { CarModule } from './modules/cars';
import { PricingModule } from './modules/pricing';
import { BookingModule } from './modules/bookings';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CarModule,
    DatabaseModule,
    PricingModule,
    BookingModule,
  ],
})
export class AppModule {}
