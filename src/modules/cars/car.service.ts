import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parseISO } from 'date-fns';
import { MoreThan, Repository } from 'typeorm';
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
    try {
      const { startDate, endDate } = payload;

      if (!startDate || !endDate) {
        const cars = await this._carRepository.find();

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

      const availableCars = await this._carRepository.find({
        where: {
          stock: MoreThan(0),
        },
      });
      const startDateISO = parseISO(startDate);
      const endDateISO = parseISO(endDate);
      const carDtoPromises = availableCars.map(async (car) => {
        const [averagePricePerDay, totalPrice] = await Promise.all([
          this._pricingService.getAveragePricePerDay(
            startDateISO,
            endDateISO,
            car.id,
          ),
          this._pricingService.getTotalPrice(startDateISO, endDateISO, car.id),
        ]);

        return new CarDto({
          id: car.id,
          brand: car.brand,
          modelName: car.modelName,
          stock: car.stock,
          averagePricePerDay,
          totalPrice,
        });
      });

      return await Promise.all(carDtoPromises);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
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
