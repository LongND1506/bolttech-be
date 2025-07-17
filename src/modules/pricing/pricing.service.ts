import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  eachDayOfInterval,
  isEqual,
  isWithinInterval,
  subDays,
} from 'date-fns';
import { PricingEntity } from './pricing.entity';
import { Season } from './season.enum';
import { CreatePricingDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(PricingEntity)
    private readonly _pricingRepository: Repository<PricingEntity>,
  ) {}

  async createNewPricing(payload: CreatePricingDto[]): Promise<void> {
    try {
      const records = this._pricingRepository.create(payload);
      await this._pricingRepository.insert(records);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  getCurrentSeason(date: Date): Season {
    const seasonRangeMapper = this.getSeasonRangeMapper(date);

    for (const [seasonRange, season] of seasonRangeMapper) {
      const [startDate, endDate] = seasonRange;
      if (isWithinInterval(date, { start: startDate, end: endDate })) {
        return season;
      }
    }

    return Season.Off;
  }

  getTotalPrice(
    startDate: Date,
    endDate: Date,
    prices: PricingEntity[],
  ): number {
    //Calculate array of dates between startDate and endDate
    const numberOfDates = isEqual(startDate, endDate)
      ? [startDate]
      : eachDayOfInterval({ start: startDate, end: endDate });

    const total = numberOfDates.reduce((acc, element) => {
      const season = this.getCurrentSeason(element);
      const price = prices.find((p) => p.pricingName === season);

      return price ? acc + price.value : acc;
    }, 0);

    return Number(total.toFixed(2));
  }

  getAveragePricePerDay(
    startDate: Date,
    endDate: Date,
    prices: PricingEntity[],
  ): number {
    const dates = isEqual(startDate, endDate)
      ? [startDate]
      : eachDayOfInterval({ start: startDate, end: subDays(endDate, 1) });

    if (!dates?.length) {
      return 0;
    }

    const total = this.getTotalPrice(startDate, endDate, prices);
    return Number((total / dates.length).toFixed(2));
  }

  getSeasonRangeMapper(date: Date): Map<[Date, Date], Season> {
    const year = date.getFullYear();
    return new Map([
      //<[startDate, endDate], season>
      [[new Date(`${year}-06-01`), new Date(`${year}-09-14}`)], Season.Peak], // Peak: Jun 1 - Sep 14
      [[new Date(`${year}-03-01`), new Date(`${year}-05-31}`)], Season.Mid], // Mid: Mar 1 - May 31
      [[new Date(`${year}-09-15`), new Date(`${year}-10-31}`)], Season.Mid], // Mid: Sep 15 - Oct 31
      [[new Date(`${year}-11-01`), new Date(`${year + 1}-02-29}`)], Season.Off], // Off: Nov 1 - Feb 29 Next Year
    ]);
  }
}
