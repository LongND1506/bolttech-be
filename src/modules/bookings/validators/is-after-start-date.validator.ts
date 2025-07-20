import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { parseISO } from 'date-fns';

@ValidatorConstraint({ name: 'IsAfterStartDate' })
export class IsAfterStartDate implements ValidatorConstraintInterface {
  validate(currentDate: string, args: ValidationArguments): boolean {
    const obj = args.object as CreateBookingDto;

    if (!currentDate || !obj.startDate) return true;

    const targetDate = parseISO(currentDate);
    const startDate = parseISO(obj.startDate);

    return targetDate >= startDate;
  }
}
