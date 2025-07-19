import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parseISO } from 'date-fns';
import { Repository } from 'typeorm';
import { CarEntity } from './car.entity';
import {
  CarDto,
  CarsQueryDto,
  CreateCarDto,
  CreateCarResponseDto,
} from './dto';
import { PricingService } from '../pricing/pricing.service';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(CarEntity)
    private readonly _carRepository: Repository<CarEntity>,
    private readonly _pricingService: PricingService,
  ) {}

  async getCars(payload: CarsQueryDto): Promise<CarDto[]> {
    const { startDate, endDate } = payload;
    const cars = await this._carRepository.find();

    if (!startDate || !endDate) {
      return cars?.map(
        (car) =>
          new CarDto({
            id: car.id,
            brand: car.brand,
            modelName: car.modelName,
            stock: car.stock,
            averagePricePerDay: 0,
            totalPrice: 0,
          }),
      );
    }

    const startDateISO = parseISO(startDate);
    const endDateISO = parseISO(endDate);
    const result = <CarDto[]>[];

    for (const car of cars) {
      const res = new CarDto({
        id: car.id,
        brand: car.brand,
        modelName: car.modelName,
        stock: car.stock,
        averagePricePerDay: await this._pricingService.getAveragePricePerDay(
          startDateISO,
          endDateISO,
          car.id,
        ),
        totalPrice: await this._pricingService.getTotalPrice(
          startDateISO,
          endDateISO,
          car.id,
        ),
      });

      result.push(res);
    }

    return result;
  }

  async createCar(payload: CreateCarDto): Promise<CreateCarResponseDto> {
    const { brand, modelName, pricings, stock } = payload;

    try {
      const record = this._carRepository.create({
        brand,
        modelName,
        stock,
      });
      const result = await this._carRepository.save(record);

      await this._pricingService.createNewPricing(
        pricings?.map((pr) => ({
          ...pr,
          car: {
            ...result,
          },
        })),
      );

      return {
        id: result.id,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
