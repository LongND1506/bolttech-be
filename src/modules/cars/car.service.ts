import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parseISO } from 'date-fns';
import { Repository } from 'typeorm';
import { PricingService } from '../pricing';
import { CarEntity } from './car.entity';
import {
  CarsQueryDto,
  CarDto,
  CreateCarDto,
  CreateCarResponseDto,
} from './dto';

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

    const res = cars?.map(
      (car) =>
        new CarDto({
          id: car.id,
          brand: car.brand,
          modelName: car.modelName,
          stock: car.stock,
          averagePricePerDay: this._pricingService.getAveragePricePerDay(
            startDateISO,
            endDateISO,
            car.prices,
          ),
          totalPrice: this._pricingService.getTotalPrice(
            startDateISO,
            endDateISO,
            car.prices,
          ),
        }),
    );

    return res;
  }

  async createCar(payload: CreateCarDto): Promise<CreateCarResponseDto> {
    const { brand, modelName, pricings, stock } = payload;

    try {
      const record = this._carRepository.create({
        brand,
        modelName,
        stock,
      });
      const result = await this._carRepository.insert(record);
      const carId = result.raw['insertId'];

      await this._pricingService.createNewPricing(
        pricings?.map((pr) => ({
          ...pr,
          carId: pr.carId ?? carId,
        })),
      );

      return {
        id: carId,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
