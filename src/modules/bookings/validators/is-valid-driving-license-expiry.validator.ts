import {
  isDate,
  ValidationArguments,
  ValidatorConstraint,
} from 'class-validator';
import { CreateBookingDto } from '../dto';

@ValidatorConstraint({ name: 'IsValidDrivingLicenseExpiry' })
export class IsValidDrivingLicenseExpiryValidator {
  validate(drivingLicenseExpiry: Date, args: ValidationArguments): boolean {
    const obj = args.object as CreateBookingDto;

    if (!isDate(drivingLicenseExpiry) || !isDate(obj.endDate)) return false;

    return drivingLicenseExpiry < obj.endDate;
  }
}
