import {
  differenceInCalendarDays,
  endOfMonth,
  endOfQuarter,
  format,
  getQuarter,
  getYear,
  startOfMonth,
  startOfQuarter,
  subDays,
  addDays,
} from "date-fns";

import { EventHorizonType } from "@/api/types/eventHorizonType";

import { hyphenatedDate, parseDateString } from "./dates";

export type EventDateShape = "date" | "month" | "quarter";

export type EventRangeWeeks = 0 | 1 | 2 | 3 | 4;

export interface EventHorizonPickerValue {
  shape: EventDateShape;
  // Anchor date. Required for "date" (the picked date itself); used only to
  // identify the target month/quarter for "month"/"quarter".
  date: Date;
  // Required when shape is "date". 0 means no range (just this date).
  rangeWeeks?: EventRangeWeeks;
}

export interface EventHorizonDto {
  date: string | null;
  start_date: string;
  end_date: string;
  horizon_type: EventHorizonType;
}

/**
 * Resolves a user's date-shape pick into the `date`/`start_date`/`end_date`/`horizon_type`
 * fields the event API expects. See reference horizon resolution table.
 */
export const resolveEventHorizon = (
  value: EventHorizonPickerValue
): EventHorizonDto => {
  switch (value.shape) {
    case "date": {
      const rangeWeeks = value.rangeWeeks ?? 0;
      const date = hyphenatedDate(value.date);
      if (rangeWeeks === 0) {
        return {
          date,
          start_date: date,
          end_date: date,
          horizon_type: EventHorizonType.RANGE,
        };
      }
      const rangeDays = rangeWeeks * 7;
      return {
        date,
        start_date: hyphenatedDate(subDays(value.date, rangeDays)),
        end_date: hyphenatedDate(addDays(value.date, rangeDays)),
        horizon_type: EventHorizonType.RANGE,
      };
    }
    case "month":
      return {
        date: null,
        start_date: hyphenatedDate(startOfMonth(value.date)),
        end_date: hyphenatedDate(endOfMonth(value.date)),
        horizon_type: EventHorizonType.MONTH,
      };
    case "quarter":
      return {
        date: null,
        start_date: hyphenatedDate(startOfQuarter(value.date)),
        end_date: hyphenatedDate(endOfQuarter(value.date)),
        horizon_type: EventHorizonType.QUARTER,
      };
  }
};

/**
 * Inverse of {@link resolveEventHorizon}: recovers the picker value (shape,
 * anchor date, range) from an event's stored horizon fields so an existing
 * event can be edited without silently rewriting its horizon. A stored RANGE
 * whose span isn't a clean ±N weeks snaps to the nearest 1–4 week bucket.
 */
export const deriveEventHorizonPickerValue = (event: {
  date?: string | null;
  start_date: string;
  end_date: string;
  horizon_type: EventHorizonType;
}): EventHorizonPickerValue => {
  const startDate = parseDateString(event.start_date);
  const endDate = parseDateString(event.end_date);
  const anchor = parseDateString(event.date ?? "");

  if (event.horizon_type === EventHorizonType.MONTH) {
    return { shape: "month", date: startDate ?? new Date() };
  }

  if (event.horizon_type === EventHorizonType.QUARTER) {
    return { shape: "quarter", date: startDate ?? new Date() };
  }

  if (startDate && endDate && event.start_date !== event.end_date) {
    const anchorDate = anchor ?? startDate;
    const days = differenceInCalendarDays(anchorDate, startDate);
    // days <= 0 means `date` was null/unparseable and anchor fell back to
    // startDate itself — treat as no-range rather than clamping to 1 week.
    const rangeWeeks =
      days <= 0
        ? 0
        : (Math.min(Math.max(Math.round(days / 7), 1), 4) as EventRangeWeeks);
    return { shape: "date", date: anchorDate, rangeWeeks };
  }

  return {
    shape: "date",
    date: anchor ?? startDate ?? new Date(),
    rangeWeeks: 0,
  };
};

export const getQuarterLabel = (date: Date): string =>
  `${getYear(date)}-Q${getQuarter(date)}`;

export const getMonthLabel = (date: Date): string => format(date, "yyyy-MM");

export interface EventHorizonFields {
  start_date: string;
  end_date: string;
  horizon_type: EventHorizonType;
}

export interface EventHorizonClassification {
  isSoft: boolean;
  tooltip: string | null;
}

/**
 * Classifies an event's horizon fields into the display rules from reference:
 * the date column gets an asterisk (and a tooltip) whenever the event isn't a
 * single hard date.
 */
export const classifyEventHorizon = (
  event: EventHorizonFields
): EventHorizonClassification => {
  const startDate = parseDateString(event.start_date);
  const endDate = parseDateString(event.end_date);

  if (event.horizon_type === EventHorizonType.MONTH && startDate) {
    return {
      isSoft: true,
      tooltip: `Catalyst expected within the target month: ${getMonthLabel(startDate)}`,
    };
  }

  if (event.horizon_type === EventHorizonType.QUARTER && startDate) {
    return {
      isSoft: true,
      tooltip: `Catalyst expected within the target Quarter: ${getQuarterLabel(startDate)}`,
    };
  }

  if (event.start_date !== event.end_date) {
    return {
      isSoft: true,
      tooltip:
        startDate && endDate
          ? `Catalyst expected within the range: ${hyphenatedDate(startDate)} - ${hyphenatedDate(endDate)}`
          : null,
    };
  }

  return { isSoft: false, tooltip: null };
};
