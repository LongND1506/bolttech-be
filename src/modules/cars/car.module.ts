import { Module } from '@nestjs/common';
import { PricingModule } from '../pricing';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from './car.entity';

@Module({
  imports: [PricingModule, TypeOrmModule.forFeature([CarEntity])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
