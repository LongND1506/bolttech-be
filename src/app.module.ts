import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructures';

import { AuthModule } from './modules/authentication/auth.module';
import { CarModule } from './modules/cars/car.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { BookingModule } from './modules/bookings/booking.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CarModule,
    DatabaseModule,
    PricingModule,
    BookingModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
