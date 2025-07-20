import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { parseISO } from 'date-fns';
import { getTomorrowDate } from '../../../shared';

@ValidatorConstraint({ name: 'IsAfterToday' })
export class IsAfterToday implements ValidatorConstraintInterface {
  validate(currentDate: string): boolean {
    if (!currentDate) return true;

    const tomorrowDate = getTomorrowDate();
    return parseISO(currentDate) >= tomorrowDate;
  }
}
