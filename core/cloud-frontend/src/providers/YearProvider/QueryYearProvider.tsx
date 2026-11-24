import { PropsWithChildren, useCallback, useMemo } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { currentYear } from "@/modules/dashboard/widgets/MonthlyPerformance/components/MonthlyPerformanceTable/MonthlyPerformanceTable.utils";
import { YearContext } from "./YearContext";

export interface QueryYearProviderProps {
  defaultYear?: string;
}

export const QueryYearProvider = ({
  defaultYear = currentYear.toString(),
  children,
}: PropsWithChildren<QueryYearProviderProps>) => {
  const [selectedYear, setSelectedYearState] = useQueryState(
    "year",
    parseAsString.withDefault(defaultYear)
  );

  const setSelectedYear = useCallback(
    (year: string) => {
      setSelectedYearState(year);
    },
    [setSelectedYearState]
  );

  const value = useMemo(
    () => ({
      selectedYear,
      setSelectedYear,
    }),
    [selectedYear, setSelectedYear]
  );

  return <YearContext.Provider value={value}>{children}</YearContext.Provider>;
};
