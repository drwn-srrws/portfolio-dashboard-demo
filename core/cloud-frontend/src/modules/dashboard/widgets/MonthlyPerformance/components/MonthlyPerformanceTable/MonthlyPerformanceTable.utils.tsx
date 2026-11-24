import { hyphenatedDate } from "@/utils/dates";
import {
  addMonths,
  differenceInMonths,
  endOfMonth,
  endOfYear,
  formatISO,
  isAfter,
  parse,
  parseISO,
  startOfMonth,
  startOfYear,
} from "date-fns";

import { MetricResult } from "@api/types/index";

export type MonthlyPerformanceTableRow = {
  [key: string]: string | number | string[];
  id: string;
};

export const formatMonthlyPerformanceData = (
  totalData: Pick<MetricResult, "data">,
  byMonthData: Pick<MetricResult, "data">[],
  groupBy: string,
  dateRanges: { start: string; end: string }[],
  totalMetric: string
): MonthlyPerformanceTableRow[] => {
  if (!totalData || !byMonthData) return [];

  return (totalData.data || []).map(
    (data) =>
      ({
        ...data,
        [totalMetric]: data?.[totalMetric],
        ...byMonthData.reduce((acc, current, index) => {
          const start = dateRanges[index].start;
          const end = dateRanges[index].end;
          const field = `${start}-${end}`;

          const currentValue = current.data?.find(
            (r) => r[groupBy] === data?.[groupBy]
          )?.[totalMetric];

          return {
            ...acc,
            id: `${data?.[groupBy]}-${field}`,
            [field]: currentValue,
          };
        }, {}),
      }) as MonthlyPerformanceTableRow
  );
};

export const generateMonthlyBreakdown = (
  startDateString: string,
  endDateString: string
) => {
  const startDate = parseISO(startDateString);
  const endDate = parseISO(endDateString);
  const monthCount =
    differenceInMonths(endOfMonth(endDate), startOfMonth(startDate)) + 1;

  return Array.from({ length: monthCount }, (_, i) => {
    const currentStart =
      i === 0 ? startDate : startOfMonth(addMonths(startDate, i));
    const currentEnd =
      i === monthCount - 1 ? endDate : endOfMonth(currentStart);

    return {
      start: formatISO(currentStart, { representation: "date" }),
      end: formatISO(currentEnd, { representation: "date" }),
    };
  });
};

export const getDateRangeByYear = (year: string) => {
  const now = new Date();
  const yearDate = parse(year, "yyyy", now);

  const firstDay = hyphenatedDate(startOfYear(yearDate));
  const lastDay = hyphenatedDate(endOfYear(yearDate));

  const start = firstDay;
  const end = isAfter(lastDay, now) ? hyphenatedDate(now) : lastDay;

  return {
    start,
    end,
  };
};

export const currentYear = new Date().getFullYear();

const startYear = 2021;
const endYear = currentYear;

export const generateYears = ({
  startYear,
  endYear,
}: {
  startYear: number;
  endYear: number;
}) => {
  const years = endYear - startYear + 1;

  return Array.from({ length: years }, (_, index) => startYear + index);
};

export const years = generateYears({ startYear, endYear });
