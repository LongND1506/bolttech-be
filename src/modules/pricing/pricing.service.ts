import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { eachDayOfInterval, isEqual, isWithinInterval } from 'date-fns';
import { Repository } from 'typeorm';
import { CreatePricingDto } from './dto/create-pricing.dto';
import { PricingEntity } from './pricing.entity';
import { Season } from './season.enum';

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

  async getTotalPrice(
    startDate: Date,
    endDate: Date,
    cardId: string,
  ): Promise<number> {
    //Calculate array of dates between startDate and endDate
    const numberOfDates = isEqual(startDate, endDate)
      ? [startDate]
      : eachDayOfInterval({ start: startDate, end: endDate });
    let total = 0;

    for (const date of numberOfDates) {
      const season = this.getCurrentSeason(date);
      const price = await this._pricingRepository.findOneBy({
        season,
        car: { id: cardId },
      });
      total += price ? price.price : 0;
    }

    return Number(total.toFixed(2));
  }

  async getAveragePricePerDay(
    startDate: Date,
    endDate: Date,
    cardId: string,
  ): Promise<number> {
    const dates = isEqual(startDate, endDate)
      ? [startDate]
      : eachDayOfInterval({ start: startDate, end: endDate });

    if (!dates?.length) {
      return 0;
    }

    const total = await this.getTotalPrice(startDate, endDate, cardId);
    return Number((total / dates.length).toFixed(2));
  }

  getSeasonRangeMapper(date: Date): Map<[Date, Date], Season> {
    const year = date.getFullYear();
    return new Map([
      //<[startDate, endDate], season>
      [[new Date(`${year}-06-01`), new Date(`${year}-09-14`)], Season.Peak], // Peak: Jun 1 - Sep 14
      [[new Date(`${year}-03-01`), new Date(`${year}-05-31`)], Season.Mid], // Mid: Mar 1 - May 31
      [[new Date(`${year}-09-15`), new Date(`${year}-10-31`)], Season.Mid], // Mid: Sep 15 - Oct 31
      [[new Date(`${year}-11-01`), new Date(`${year + 1}-02-29`)], Season.Off], // Off: Nov 1 - Feb 29 Next Year
    ]);
  }
}
