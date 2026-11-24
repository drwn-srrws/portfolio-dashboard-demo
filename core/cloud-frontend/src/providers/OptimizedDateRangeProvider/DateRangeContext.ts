import { createContext, useContext } from "react";
import type { DateRangeRequest } from "@/api/aliases";
import { startOfYear } from "date-fns";
import { hyphenatedDate } from "@/utils";
import { DatePeriod } from "@typings/DatePeriod";

export interface IDateRangeContext {
  startDate: string;
  endDate: string;
  datePeriod: DatePeriod;
  requestDateRange: DateRangeRequest;
  setStartDate: (startDate?: string) => void;
  setEndDate: (endDate?: string) => void;
  setDatePeriod: (datePeriod: DatePeriod) => void;
  resetDateRange: () => void;
  __provider: "optimized" | "none";
}

export const DateRangeContext = createContext<IDateRangeContext>({
  startDate: hyphenatedDate(startOfYear(new Date())),
  endDate: hyphenatedDate(new Date()),
  datePeriod: DatePeriod.YTD,
  requestDateRange: { start_date: null, end_date: null, period: "YTD" },
  setStartDate: () => {},
  setEndDate: () => {},
  setDatePeriod: () => {},
  resetDateRange: () => {},
  __provider: "none",
});

export const useOptimizedDateRange = () => useContext(DateRangeContext);
