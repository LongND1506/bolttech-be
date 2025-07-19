import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from './car.entity';
import { PricingModule } from '../pricing/pricing.module';

@Module({
  imports: [PricingModule, TypeOrmModule.forFeature([CarEntity])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
