import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructures';
import { CarModule } from './modules/cars';
import { PricingModule } from './modules/pricing';
import { BookingModule } from './modules/bookings';
import { UserModule } from './modules/user';
import { AuthModule } from './modules/authentication/auth.module';

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
