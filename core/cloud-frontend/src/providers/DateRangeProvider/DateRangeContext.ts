import { createContext, useContext } from "react";
import { startOfYear } from "date-fns";
import { hyphenatedDate } from "@/utils";
import { DatePeriod } from "@typings/DatePeriod";

export interface IDateRangeContext {
  startDate?: string;
  endDate?: string;
  datePeriod: DatePeriod;
  setStartDate: (startDate?: string) => void;
  setEndDate: (endDate?: string) => void;
  setDatePeriod: (datePeriod: DatePeriod) => void;
  resetDateRange: () => void;
}

export const DateRangeContext = createContext<IDateRangeContext>({
  startDate: hyphenatedDate(startOfYear(new Date())),
  endDate: hyphenatedDate(new Date()),
  datePeriod: DatePeriod.YTD,
  setStartDate: () => {},
  setEndDate: () => {},
  setDatePeriod: () => {},
  resetDateRange: () => {},
});

export const useDateRange = () => useContext(DateRangeContext);
