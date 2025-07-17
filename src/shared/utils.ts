import { addDays, startOfDay } from 'date-fns';

export function getTomorrowDate(): Date {
  return startOfDay(addDays(new Date(), 1));
}
