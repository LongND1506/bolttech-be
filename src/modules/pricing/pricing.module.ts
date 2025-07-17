import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingEntity } from './pricing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PricingEntity])],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}
