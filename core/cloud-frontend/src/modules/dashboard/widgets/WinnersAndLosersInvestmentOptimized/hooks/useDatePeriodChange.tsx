import { useCallback, useState, useEffect } from "react";
import { DatePeriod } from "@/typings/DatePeriod";
import { getDateRangeByDatePeriod, hyphenatedDate } from "@/utils";

interface UseDatePeriodChangeProps {
  startDate?: string;
  endDate?: string;
  defaultPeriod?: DatePeriod;
}

interface DateRangeResult {
  localStartDate: string | undefined;
  localEndDate: string | undefined;
  datePeriod: DatePeriod;
  handleDatePeriodChange: (value: string | number | boolean) => void;
}

export const useDatePeriodChange = ({
  startDate,
  endDate,
  defaultPeriod = "T1D",
}: UseDatePeriodChangeProps): DateRangeResult => {
  const [datePeriod, setDatePeriod] = useState<DatePeriod>(defaultPeriod);
  const [localStartDate, setLocalStartDate] = useState<string | undefined>(
    undefined
  );
  const [localEndDate, setLocalEndDate] = useState<string | undefined>(
    undefined
  );

  const applyDatePeriod = useCallback(
    (period: DatePeriod) => {
      const startDateFulfilled = new Date(startDate || "");
      const endDateFulfilled = new Date(endDate || new Date());

      const { start, end } = getDateRangeByDatePeriod(
        period,
        startDateFulfilled,
        endDateFulfilled
      );

      setLocalStartDate(hyphenatedDate(start));
      setLocalEndDate(hyphenatedDate(end));
    },
    [startDate, endDate]
  );

  useEffect(() => {
    applyDatePeriod(defaultPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDatePeriodChange = useCallback(
    (value: string | number | boolean) => {
      const period = String(value) as DatePeriod;
      setDatePeriod(period);
      applyDatePeriod(period);
    },
    [applyDatePeriod]
  );

  return {
    localStartDate,
    localEndDate,
    datePeriod,
    handleDatePeriodChange,
  };
};
