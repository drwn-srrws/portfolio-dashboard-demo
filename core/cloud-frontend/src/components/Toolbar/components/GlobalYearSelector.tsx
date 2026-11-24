import { useMemo, useCallback } from "react";
import { TextSelect } from "@/components/TextSelect";
import { useYear } from "@/providers/YearProvider";
import { years } from "@/modules/dashboard/widgets/MonthlyPerformance/components/MonthlyPerformanceTable/MonthlyPerformanceTable.utils";

export const GlobalYearSelector = () => {
  const { selectedYear, setSelectedYear } = useYear();

  const yearOptions = useMemo(
    () =>
      years.map((year) => ({
        label: year.toString(),
        value: year.toString(),
      })),
    []
  );

  const handleYearChange = useCallback(
    (value: string | number | boolean) => {
      setSelectedYear(value.toString());
    },
    [setSelectedYear]
  );

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-300">Year:</span>
      <TextSelect
        disablePortal
        virtual
        options={yearOptions}
        value={selectedYear}
        placeholder="Select Year"
        onChange={handleYearChange}
        testId="global-year-selector"
      />
    </div>
  );
};
