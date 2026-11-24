import { ReactNode, useCallback, useMemo, useState } from "react";
import { startOfYear } from "date-fns";
import { DatePeriod } from "@typings/DatePeriod";
import { hyphenatedDate } from "@/utils";
import { DateRangeContext } from "./DateRangeContext";

export interface DateRangeProviderProps {
  defaultStartDate?: string;
  defaultEndDate?: string;
  defaultDatePeriod?: DatePeriod;
  children?: ReactNode;
}

export const DateRangeProvider = ({
  defaultStartDate = hyphenatedDate(startOfYear(new Date())),
  defaultEndDate = hyphenatedDate(new Date()),
  defaultDatePeriod = DatePeriod.YTD,
  children,
}: DateRangeProviderProps) => {
  const [startDate, setStartDate] = useState<string | undefined>(
    defaultStartDate
  );
  const [endDate, setEndDate] = useState<string | undefined>(defaultEndDate);
  const [datePeriod, setDatePeriod] = useState<DatePeriod>(defaultDatePeriod);

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
    [datePeriod, endDate, resetDateRange, startDate]
  );

  return (
    <DateRangeContext.Provider value={context}>
      {children}
    </DateRangeContext.Provider>
  );
};
