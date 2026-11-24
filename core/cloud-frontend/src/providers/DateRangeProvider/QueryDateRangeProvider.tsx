import { ReactNode, useCallback, useMemo } from "react";
import { startOfYear } from "date-fns";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { DatePeriod } from "@typings/DatePeriod";
import { hyphenatedDate } from "@/utils";
import { DateRangeContext } from "./DateRangeContext";

export interface QueryDateRangeProviderProps {
  defaultStartDate?: string;
  defaultEndDate?: string;
  defaultDatePeriod?: DatePeriod;
  children?: ReactNode;
}

export const QueryDateRangeProvider = ({
  defaultStartDate = hyphenatedDate(startOfYear(new Date())),
  defaultEndDate = hyphenatedDate(new Date()),
  defaultDatePeriod = DatePeriod.YTD,
  children,
}: QueryDateRangeProviderProps) => {
  const [startDate, setStartDate] = useQueryState(
    "start_date",
    parseAsString.withDefault(defaultStartDate)
  );

  const [endDate, setEndDate] = useQueryState(
    "end_date",
    parseAsString.withDefault(defaultEndDate)
  );

  const [datePeriod, setDatePeriod] = useQueryState(
    "date_period",
    parseAsStringLiteral(Object.values(DatePeriod)).withDefault(
      defaultDatePeriod
    )
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

  const context = useMemo(
    () => ({
      startDate,
      endDate,
      datePeriod,
      resetDateRange,
      setStartDate,
      setEndDate,
      setDatePeriod,
    }),
    [
      datePeriod,
      resetDateRange,
      endDate,
      setDatePeriod,
      setEndDate,
      setStartDate,
      startDate,
    ]
  );

  return (
    // @ts-expect-error - TODO: Fix this type issue
    <DateRangeContext.Provider value={context}>
      {children}
    </DateRangeContext.Provider>
  );
};
