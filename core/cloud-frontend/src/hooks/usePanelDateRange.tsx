import { useMemo } from "react";
import { startOfYear } from "date-fns";

import { getDateRangeByDatePeriod, hyphenatedDate } from "@/utils";
import { usePanel } from "@providers/PanelProvider";

export const usePanelDateRange = () => {
  const { params } = usePanel();

  const defaultStartDate = params?.setDateRangeSettings?.range?.from;
  const defaultEndDate = params?.setDateRangeSettings?.range?.to;
  const defaultDatePeriod = params?.setDateRangeSettings?.type;

  const { startDate, endDate } = useMemo(() => {
    if (!defaultDatePeriod) return { start: null, end: null };

    const startDateFullfilled = new Date(
      defaultStartDate || startOfYear(new Date())
    );
    const endDateFullfilled = new Date(defaultEndDate || new Date());

    const { start, end } = getDateRangeByDatePeriod(
      defaultDatePeriod,
      startDateFullfilled,
      endDateFullfilled
    );

    const newStartDate = hyphenatedDate(start);
    const newEndDate = hyphenatedDate(end);

    return { startDate: newStartDate, endDate: newEndDate };
  }, [defaultDatePeriod, defaultStartDate, defaultEndDate]);

  return { startDate, endDate };
};
