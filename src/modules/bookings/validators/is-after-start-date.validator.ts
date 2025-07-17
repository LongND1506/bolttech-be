import {
  isDate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateBookingDto } from '../dto/create-booking.dto';

@ValidatorConstraint({ name: 'IsAfterStartDate' })
export class IsAfterStartDate implements ValidatorConstraintInterface {
  validate(currentDate: Date, args: ValidationArguments): boolean {
    const obj = args.object as CreateBookingDto;

    if (!isDate(currentDate) || !isDate(obj.startDate)) return false;

    return currentDate > obj.startDate;
  }
}
