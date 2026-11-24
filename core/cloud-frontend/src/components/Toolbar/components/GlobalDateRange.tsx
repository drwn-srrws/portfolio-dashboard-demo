import { useCallback, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { useDateRange as useLegacyDateRange } from "@/providers/DateRangeProvider";
import { useOptimizedDateRange } from "@/providers/OptimizedDateRangeProvider";
import {
  getDateRangeByDatePeriod,
  hyphenatedDate,
  parseDateString,
} from "@/utils/index";
import { DatePeriod } from "@typings/DatePeriod";
import { DateRangeSinglePicker } from "@components/DateRangeSinglePicker";
import { dateRangeTabOptions } from "../constants/dateRangeTabOptions";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { TabOption } from "../../Tabs/Tabs";
import { parse } from "date-fns";

export interface GlobalDateRangeProps {
  options?: TabOption[];
}

export const GlobalDateRange = ({
  options = dateRangeTabOptions,
}: GlobalDateRangeProps) => {
  const legacy = useLegacyDateRange();
  const optimized = useOptimizedDateRange();
  const {
    startDate,
    endDate,
    datePeriod,
    setStartDate,
    setEndDate,
    setDatePeriod,
  } = optimized.__provider === "optimized" ? optimized : legacy;

  const handleDateChange = useCallback(
    (value: string) => {
      const date = value as DatePeriod;

      const startDateFullfilled = parse(
        startDate || "",
        "yyyy-MM-dd",
        new Date()
      );
      const endDateFullfilled = parse(endDate || "", "yyyy-MM-dd", new Date());

      const { start, end } = getDateRangeByDatePeriod(
        date,
        startDateFullfilled,
        endDateFullfilled
      );

      const newStartDate = hyphenatedDate(start);
      const newEndDate = hyphenatedDate(end);

      setStartDate(newStartDate);
      setEndDate(newEndDate);
      setDatePeriod(date);
    },
    [endDate, setDatePeriod, setEndDate, setStartDate, startDate]
  );

  const handleChangeCustomDateRange = useCallback(
    (date: DateRange | undefined) => {
      const hyphenatedStartDate = date?.from
        ? hyphenatedDate(date.from)
        : undefined;
      const hyphenatedEndDate = date?.to ? hyphenatedDate(date.to) : undefined;

      setStartDate(hyphenatedStartDate);
      setEndDate(hyphenatedEndDate);
    },
    [setEndDate, setStartDate]
  );

  const parsedDateRange = useMemo(
    () => ({
      start: startDate ? parseDateString(startDate) : undefined,
      end: endDate ? parseDateString(endDate) : undefined,
    }),
    [endDate, startDate]
  );

  const customDateRange = useMemo(
    () => ({
      from: parsedDateRange.start || undefined,
      to: parsedDateRange.end || undefined,
    }),
    [parsedDateRange.end, parsedDateRange.start]
  );

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <Tabs
        value={datePeriod}
        className="w-full md:w-auto"
        onValueChange={handleDateChange}
      >
        <TabsList className="flex justify-between gap-2">
          {options.map(({ id, title }) => (
            <TabsTrigger
              value={id}
              key={id}
              data-testid={id}
              className="flex-grow"
            >
              {title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {datePeriod === "CUSTOM" && (
        <DateRangeSinglePicker
          date={customDateRange}
          setDate={handleChangeCustomDateRange}
          className="w-full md:w-auto"
        />
      )}
    </div>
  );
};
