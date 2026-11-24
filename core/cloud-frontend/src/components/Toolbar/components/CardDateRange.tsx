import { useCallback, useMemo } from "react";
import { DateRange } from "react-day-picker";

import { DateRangeSinglePicker } from "@components/DateRangeSinglePicker";
import { hyphenatedDate, parseDateString } from "@/utils/index";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { dateRangeTabOptions } from "../constants/dateRangeTabOptions";

export interface CardDateRangeProps {
  period: string;
  startDate?: string;
  endDate?: string;
  onPeriodChange: (period: string) => void;
  onCustomDateChange: (startDate?: string, endDate?: string) => void;
}

export const CardDateRange = ({
  period,
  startDate,
  endDate,
  onPeriodChange,
  onCustomDateChange,
}: CardDateRangeProps) => {
  const handleDateRangeChange = useCallback(
    (date: DateRange | undefined) => {
      onCustomDateChange(
        date?.from ? hyphenatedDate(date.from) : undefined,
        date?.to ? hyphenatedDate(date.to) : undefined
      );
    },
    [onCustomDateChange]
  );

  const customDateRange = useMemo(
    () => ({
      from: startDate ? (parseDateString(startDate) ?? undefined) : undefined,
      to: endDate ? (parseDateString(endDate) ?? undefined) : undefined,
    }),
    [startDate, endDate]
  );

  return (
    <div className="flex flex-wrap gap-3">
      <Tabs value={period} onValueChange={onPeriodChange}>
        <TabsList className="flex justify-between gap-2">
          {dateRangeTabOptions.map(({ id, title }) => (
            <TabsTrigger value={id} key={id} className="flex-grow">
              {title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {period === "CUSTOM" && (
        <DateRangeSinglePicker
          date={customDateRange}
          setDate={handleDateRangeChange}
          className="w-full md:w-auto"
        />
      )}
    </div>
  );
};
