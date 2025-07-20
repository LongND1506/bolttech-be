import { CarEntity } from 'src/modules/cars/car.entity';
import { PricingEntity } from 'src/modules/pricing/pricing.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { CARS_MOCK } from '../mocks';

export default class CarSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query(
      'TRUNCATE "pricing_entity" RESTART IDENTITY CASCADE;',
    );
    await dataSource.query(
      'TRUNCATE "booking_entity" RESTART IDENTITY CASCADE;',
    );
    await dataSource.query('TRUNCATE "car_entity" RESTART IDENTITY CASCADE;');

    const pricingRepository = dataSource.getRepository(PricingEntity);
    const carRepository = dataSource.getRepository(CarEntity);

    for (const car of CARS_MOCK) {
      const newCar = carRepository.create(car);
      await carRepository.save(newCar);

      const pricings = car.pricings.map((pricing) => ({
        ...pricing,
        car: newCar,
      }));
      await pricingRepository.save(pricings);
    }
  }
}
