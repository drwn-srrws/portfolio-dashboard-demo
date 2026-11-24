import { useCallback, useMemo } from "react";
import { DatePeriod } from "@/typings/DatePeriod";
import { usePanelDateRange } from "@/hooks/usePanelDateRange";
import { useOptimizedDateRange } from "@/providers/OptimizedDateRangeProvider";
import { useDatePeriodChange } from "./useDatePeriodChange";
import { compactDateRangeRequest } from "@/utils/dateRange";
import type { DateRangeRequest, DateRangeRequestPeriod } from "@/api/aliases";

interface WidgetDatesResult {
  dateRange: DateRangeRequest;
  datePeriod: DatePeriod;
  handleDatePeriodChange: (value: string | number | boolean) => void;
}

export const useResolvedDates = (
  showDateRangeSelect = false,
  defaultPeriod: DatePeriod = "YTD"
): WidgetDatesResult => {
  const { startDate: panelStartDate, endDate: panelEndDate } =
    usePanelDateRange();
  const {
    requestDateRange,
    startDate: selectedStartDate,
    endDate: selectedEndDate,
  } = useOptimizedDateRange();

  const defaultShortcutPeriod = useMemo<DatePeriod>(() => {
    switch (defaultPeriod) {
      case "DTD":
      case "WTD":
      case "MTD":
      case "QTD":
      case "YTD":
      case "ITD":
        return defaultPeriod;
      default:
        return "YTD";
    }
  }, [defaultPeriod]);

  const { datePeriod, handleDatePeriodChange } = useDatePeriodChange({
    startDate: selectedStartDate,
    endDate: selectedEndDate,
    defaultPeriod: showDateRangeSelect ? defaultShortcutPeriod : "T1D",
  });

  const noopHandler = useCallback(() => {}, []);

  const periodForApi = useMemo<DateRangeRequestPeriod>(() => {
    switch (datePeriod) {
      case "DTD":
      case "WTD":
      case "MTD":
      case "QTD":
      case "YTD":
      case "ITD":
        return datePeriod;
      default:
        return "YTD";
    }
  }, [datePeriod]);

  const dateRange: DateRangeRequest = useMemo(() => {
    if (showDateRangeSelect) {
      return compactDateRangeRequest({ period: periodForApi });
    }

    if (panelStartDate || panelEndDate) {
      return compactDateRangeRequest({
        start_date: panelStartDate,
        end_date: panelEndDate,
      });
    }

    return compactDateRangeRequest(requestDateRange);
  }, [
    panelEndDate,
    panelStartDate,
    periodForApi,
    requestDateRange,
    showDateRangeSelect,
  ]);

  return {
    dateRange,
    datePeriod: showDateRangeSelect ? datePeriod : "T1D",
    handleDatePeriodChange: showDateRangeSelect
      ? handleDatePeriodChange
      : noopHandler,
  };
};
