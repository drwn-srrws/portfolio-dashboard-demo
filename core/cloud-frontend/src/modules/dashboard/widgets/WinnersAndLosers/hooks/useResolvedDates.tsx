import { useCallback } from "react";
import { DatePeriod } from "@/typings/DatePeriod";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { useDateRange } from "@/providers/DateRangeProvider";
import { useDatePeriodChange } from "./useDatePeriodChange";

interface WidgetDatesResult {
  startDate: string | undefined;
  endDate: string | undefined;
  datePeriod: DatePeriod;
  handleDatePeriodChange: (value: string | number | boolean) => void;
}

export const useResolvedDates = (
  showDateRangeSelect = false
): WidgetDatesResult => {
  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const { startDate: globalStartDate, endDate: globalEndDate } = useDateRange();

  const { localStartDate, localEndDate, datePeriod, handleDatePeriodChange } =
    useDatePeriodChange({
      startDate: globalStartDate,
      endDate: globalEndDate,
      defaultPeriod: "YTD",
    });

  const noopHandler = useCallback(() => {}, []);

  return {
    startDate:
      showDateRangeSelect && localStartDate
        ? localStartDate
        : panelStartDate || globalStartDate,
    endDate:
      showDateRangeSelect && localEndDate
        ? localEndDate
        : panelEndDate || globalEndDate,
    datePeriod: showDateRangeSelect ? datePeriod : "T1D",
    handleDatePeriodChange: showDateRangeSelect
      ? handleDatePeriodChange
      : noopHandler,
  };
};
