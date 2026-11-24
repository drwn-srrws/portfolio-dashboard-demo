import { ReactNode, useCallback, useMemo } from "react";
import { startOfYear } from "date-fns";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { hyphenatedDate } from "@/utils";
import { DateRangeContext } from "./DateRangeContext";
import type { DateRangeRequest, DateRangeRequestPeriod } from "@/api/aliases";
import type { DatePeriod } from "@typings/DatePeriod";

const DATE_PERIOD_OPTIONS = [
  "YTD",
  "QTD",
  "MTD",
  "WTD",
  "ITD",
  "CUSTOM",
] as const;
type OptimizedDatePeriod = (typeof DATE_PERIOD_OPTIONS)[number];
export interface QueryDateRangeProviderProps {
  defaultStartDate?: string;
  defaultEndDate?: string;
  defaultDatePeriod?: OptimizedDatePeriod;
  children?: ReactNode;
}

export const QueryDateRangeProvider = ({
  defaultStartDate = hyphenatedDate(startOfYear(new Date())),
  defaultEndDate = hyphenatedDate(new Date()),
  defaultDatePeriod = "YTD",
  children,
}: QueryDateRangeProviderProps) => {
  const [datePeriod, setDatePeriodQuery] = useQueryState(
    "date_period",
    parseAsStringLiteral(DATE_PERIOD_OPTIONS).withDefault(defaultDatePeriod)
  );

  const [startDate, setStartDateQuery] = useQueryState(
    "start_date",
    parseAsString.withDefault(defaultStartDate)
  );

  const [endDate, setEndDateQuery] = useQueryState(
    "end_date",
    parseAsString.withDefault(defaultEndDate)
  );

  const setStartDate = useCallback(
    (value?: string) => {
      void setStartDateQuery(value ?? null);
    },
    [setStartDateQuery]
  );

  const setEndDate = useCallback(
    (value?: string) => {
      void setEndDateQuery(value ?? null);
    },
    [setEndDateQuery]
  );

  const setDatePeriod = useCallback(
    (value: DatePeriod) => {
      void setDatePeriodQuery(value as OptimizedDatePeriod);
    },
    [setDatePeriodQuery]
  );

  const resetDateRange = useCallback(() => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setDatePeriod(defaultDatePeriod);
  }, [
    defaultDatePeriod,
    defaultEndDate,
    defaultStartDate,
    setDatePeriod,
    setEndDate,
    setStartDate,
  ]);

  const requestDateRange: DateRangeRequest = useMemo(() => {
    if (datePeriod === "CUSTOM") {
      return { start_date: startDate, end_date: endDate };
    }

    return {
      period: datePeriod as Exclude<DateRangeRequestPeriod, "CUSTOM">,
    };
  }, [datePeriod, endDate, startDate]);

  const context = useMemo(
    () => ({
      startDate,
      endDate,
      datePeriod,
      requestDateRange,
      resetDateRange,
      setStartDate,
      setEndDate,
      setDatePeriod,
      __provider: "optimized" as const,
    }),
    [
      datePeriod,
      endDate,
      requestDateRange,
      resetDateRange,
      setDatePeriod,
      setEndDate,
      setStartDate,
      startDate,
    ]
  );

  return (
    <DateRangeContext.Provider value={context}>
      {children}
    </DateRangeContext.Provider>
  );
};
