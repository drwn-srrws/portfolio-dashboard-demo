import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  subDays,
  addMonths,
  differenceInCalendarDays,
  eachMonthOfInterval,
  isWithinInterval,
  lastDayOfMonth,
  lastDayOfQuarter,
  fromUnixTime,
  isValid,
} from "date-fns";
import { cond } from "ramda";

import { DatePeriod } from "@/typings/DatePeriod";

import { capitalize } from "./strings";

export const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
export const fullDaysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const months: string[] = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export const fullMonthNames: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const monthsThatStartQuarters: string[] = ["jan", "apr", "jul", "oct"];

export const isDateWithinInterval = (start: Date, end: Date) => (date: Date) =>
  isWithinInterval(date, { start, end });

const handleDurationWithRemainder = (
  longerDurationInDays: number,
  shorterDurationInDays: number,
  daysUntilEvent: number,
  letterForLongerDuration: string,
  letterForShorterDuration: string
) => {
  const numberOfLargerUnit = Math.floor(daysUntilEvent / longerDurationInDays);
  const remainder = daysUntilEvent - numberOfLargerUnit * longerDurationInDays;
  const remainderInShorterUnit = Math.round(remainder / shorterDurationInDays);

  return remainderInShorterUnit === 0
    ? `${numberOfLargerUnit}${letterForLongerDuration}`
    : `${numberOfLargerUnit}${letterForLongerDuration} ${remainderInShorterUnit}${letterForShorterDuration}`;
};

const whenNoDaysUntil = (daysUntil: number) => daysUntil === 0;
const lessThanAWeekUntil = (daysUntil: number) => daysUntil < 7;
const lessThanAMonthUntil = (daysUntil: number) => daysUntil < 30;
const lessThanAQuarterUntil = (daysUntil: number) => daysUntil < 90;
const lessThanAYearUntil = (daysUntil: number) => daysUntil < 365;
const moreThanAYearUntil = (daysUntil: number) => daysUntil >= 365;

const thenEventIsToday = () => "Today";
const thenEventIsLessThanAWeekAway = (daysUntil: number) => `${daysUntil}d`;
const thenEventIsMultipleWeeksAway = (daysUntil: number) =>
  handleDurationWithRemainder(7, 1, daysUntil, "w", "d");
const thenEventIsMultipleMonthsAway = (daysUntil: number) =>
  handleDurationWithRemainder(30, 7, daysUntil, "m", "w");
const thenEventIsMultipleQuartersAway = (daysUntil: number) =>
  handleDurationWithRemainder(90, 30, daysUntil, "q", "m");
const thenEventIsMultipleYearsAway = (daysUntil: number) =>
  handleDurationWithRemainder(365, 30, daysUntil, "y", "m");

export const lastUpdated = (date: Date) => {
  const now = new Date();
  const days = differenceInDays(now, date);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  const hours = differenceInHours(now, date);
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const minutes = differenceInMinutes(now, date);
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  return `just now`;
};

export const roundDaysUntilEvent = (eventDate: Date) => {
  let daysUntilEvent = differenceInCalendarDays(eventDate, new Date());
  const utcEventDate = eventDate.getUTCDate();
  const utcToday = new Date().getUTCDate();

  if (daysUntilEvent === 0 && utcEventDate !== utcToday) daysUntilEvent = 1;
  else if (daysUntilEvent === -1 && utcEventDate === utcToday)
    daysUntilEvent = 0;

  return cond([
    [whenNoDaysUntil, thenEventIsToday],
    [lessThanAWeekUntil, thenEventIsLessThanAWeekAway],
    [lessThanAMonthUntil, thenEventIsMultipleWeeksAway],
    [lessThanAQuarterUntil, thenEventIsMultipleMonthsAway],
    [lessThanAYearUntil, thenEventIsMultipleQuartersAway],
    [moreThanAYearUntil, thenEventIsMultipleYearsAway],
  ])(daysUntilEvent);
};

export const convertShortHandToNumberOfDays = (shortHand: string): number => {
  const [number, unit, , number2, unit2] = shortHand.split("");
  const days = {
    d: 1,
    w: 7,
    m: 30,
    q: 90,
    y: 365,
  };
  type units = "d" | "w" | "m" | "q" | "y";

  const partOne = parseInt(number) * days[unit as units];

  if (number2 && unit2) {
    const partTwo = parseInt(number2) * days[unit2 as units];

    return partOne + partTwo;
  }

  return partOne;
};

export type DateRange = {
  start?: Date;
  end?: Date;
};

export const getNext12Months = (date: Date): DateRange[] => {
  const oneYearFromNow = addMonths(date, 12);
  const months = eachMonthOfInterval({ start: date, end: oneYearFromNow });

  const monthDurations = months.map((month) => ({
    start: month,
    end: addMonths(month, 1),
  }));

  return monthDurations;
};

export const getMonthsRemainingInCurrentQuarter = (date: Date) => {
  const endOfCurrentQuarter = lastDayOfQuarter(date);

  return eachMonthOfInterval({ start: date, end: endOfCurrentQuarter });
};

export const getNextQuarter = (date: Date): DateRange => {
  const endOfThisQuarter = lastDayOfQuarter(date);
  const firstDayOfNextQuarter = addMonths(endOfThisQuarter, 1);

  const endOfNextQuarter = lastDayOfQuarter(firstDayOfNextQuarter);

  return { start: firstDayOfNextQuarter, end: endOfNextQuarter };
};

export const getEventDateShorthand = (
  date: Date,
  duration: DateRange
): string => {
  const diffInDays = differenceInCalendarDays(duration.end!, duration.start!);
  const dayOfWeek = capitalize(daysOfWeek[date.getUTCDay()]);
  const dayOfMonth = date.getUTCDate();
  const month = capitalize(months[date.getUTCMonth()]);
  const year = date.getUTCFullYear();

  if (diffInDays < 32) return `${dayOfWeek} ${dayOfMonth}`;
  if (diffInDays < 95) return `${month}, ${dayOfWeek} ${dayOfMonth}`;
  else return `${month}/${year}, ${dayOfWeek} ${dayOfMonth}`;
};

export const humanReadableDate = (date: Date): string =>
  ` ${fullMonthNames[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;

export const slashedDate = (date: Date): string => {
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${month}/${day}/${year}`;
};

export const isSlashedDate = (date: string): boolean => {
  const [month, day, year] = date.split("/");
  return month.length === 2 && day.length === 2 && year.length === 4;
};

export const hyphenatedDate = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

export const isHyphenatedDate = (date: string): boolean => {
  try {
    const [year, month, day] = date.split("-");
    return year.length === 4 && month.length === 2 && day.length === 2;
  } catch {
    return false;
  }
};

export const getMonthAsRange = (date: Date): DateRange => ({
  start: date,
  end: lastDayOfMonth(date),
});

/**
 * Converts a date string in the format 'YYYY-MM-DD' to a Date object.
 * This ensures the date is interpreted in the user's local time zone,
 * avoiding issues where the date might be off by one day due to time zone differences.
 * @param dateString - The date string to convert.
 * @returns A Date object representing the given date.
 */
export const parseDateString = (dateString: string | Date): Date | null => {
  if (!dateString || typeof dateString !== "string") return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((dateString as any) instanceof Date) return dateString as unknown as Date;

  const removeTimezone = /T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

  const [year, month, day] = (dateString as string)
    .replace(removeTimezone, "")
    .split("-")
    .map(Number);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

  return new Date(year, month - 1, day); // month is 0-indexed
};

const SUNDAY = 0;
const MONDAY = 1;
const DAYS_TO_FRIDAY_FROM_SUNDAY = 2;
const DAYS_TO_FRIDAY_FROM_MONDAY = 3;
const DAYS_TO_PREVIOUS_DAY = 1;

/**
 * Returns the previous business day for a given date.
 * Business days are Monday through Friday.
 *
 * Examples:
 * - For Friday -> returns Thursday
 * - For Monday -> returns Friday (previous week)
 * - For Sunday -> returns Friday (previous week)
 *
 * @param date - The date to get the previous business day for
 * @returns The previous business day
 */
export const getPreviousBusinessDay = (date: Date): Date => {
  const currentDayOfWeek = date.getDay();

  const daysToPreviousBusinessDay = (() => {
    switch (currentDayOfWeek) {
      case SUNDAY:
        return DAYS_TO_FRIDAY_FROM_SUNDAY;
      case MONDAY:
        return DAYS_TO_FRIDAY_FROM_MONDAY;
      default:
        return DAYS_TO_PREVIOUS_DAY;
    }
  })();

  return subDays(date, daysToPreviousBusinessDay);
};

export const getDateRangeByDatePeriod = (
  datePeriod: DatePeriod,
  startDate: Date,
  endDate: Date
) => {
  let newStartDate: Date;

  switch (datePeriod) {
    case "T1D":
      newStartDate = getPreviousBusinessDay(endDate);
      break;
    case "T5D":
      newStartDate = subDays(endDate, 6);
      break;
    case "MTD":
      newStartDate = startOfMonth(endDate);
      break;
    case "QTD":
      newStartDate = startOfQuarter(endDate);
      break;
    case "WTD": {
      const currentDate = endDate;
      const daysToSubtract = currentDate.getDay() === 1 ? 7 : 0;
      const lastMondayDate = startOfWeek(subDays(currentDate, daysToSubtract), {
        weekStartsOn: 1,
      });
      newStartDate = lastMondayDate;
      break;
    }
    case "YTD":
      newStartDate = startOfYear(endDate);
      break;
    case "ITD": {
      newStartDate = new Date(1970, 0, 1);
      break;
    }
    case "CUSTOM":
      newStartDate = startDate ?? startOfMonth(endDate);
      break;
    default:
      newStartDate = endDate;
      break;
  }

  return {
    start: newStartDate,
    end: endDate,
  };
};

export function isUnixTimestamp(num: number) {
  const date = fromUnixTime(num);

  return isValid(date);
}
