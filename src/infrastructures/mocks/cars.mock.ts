import { CreateCarDto } from '@/modules/cars/dto';
import { Season } from '@/modules/pricing/season.enum';

export const CARS_MOCK = [
  {
    brand: 'Toyota',
    modelName: 'Yaris',
    stock: 3,
    pricings: [
      {
        season: Season.Peak,
        price: 98.43,
      },
      {
        season: Season.Mid,
        price: 76.89,
      },
      {
        season: Season.Off,
        price: 53.65,
      },
    ],
  },
  {
    brand: 'Seat',
    modelName: 'Ibiza',
    stock: 5,
    pricings: [
      {
        season: Season.Peak,
        price: 85.12,
      },
      {
        season: Season.Mid,
        price: 65.73,
      },
      {
        season: Season.Off,
        price: 46.85,
      },
    ],
  },
  {
    brand: 'Nissan',
    modelName: 'Qashqai',
    stock: 2,
    pricings: [
      {
        season: Season.Peak,
        price: 101.46,
      },
      {
        season: Season.Mid,
        price: 82.94,
      },
      {
        season: Season.Off,
        price: 59.87,
      },
    ],
  },
  {
    brand: 'Jaguar',
    modelName: 'e-pace',
    stock: 1,
    pricings: [
      {
        season: Season.Peak,
        price: 120.54,
      },
      {
        season: Season.Mid,
        price: 91.35,
      },
      {
        season: Season.Off,
        price: 70.27,
      },
    ],
  },
  {
    brand: 'Mercedes',
    modelName: 'Vito',
    stock: 2,
    pricings: [
      {
        season: Season.Peak,
        price: 109.16,
      },
      {
        season: Season.Mid,
        price: 89.64,
      },
      {
        season: Season.Off,
        price: 64.97,
      },
    ],
  },
] satisfies CreateCarDto[];
