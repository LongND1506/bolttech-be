import { BookingEntity } from '@/modules/bookings';
import { CarEntity } from '@/modules/cars';
import { PricingEntity } from '@/modules/pricing';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

const ENTITIES = [CarEntity, PricingEntity, BookingEntity];
const DEP_SERVICES = [ConfigService];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: DEP_SERVICES,
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false,
        },
        synchronize: true,
        entities: ENTITIES,
      }),
    }),
  ],
})
export class DatabaseModule {}
