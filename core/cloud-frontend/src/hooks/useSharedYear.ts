import { useYear } from "@providers/YearProvider";
import { useLocalYear } from "@providers/LocalYearProvider";
import { useEffect, useMemo } from "react";

export const useSharedYear = () => {
  const { selectedYear: globalYear } = useYear();
  const { selectedYear: localYear, setSelectedYear: setSelectedLocalYear } =
    useLocalYear();

  const selectedYear = useMemo(
    () => (localYear && localYear !== "" ? localYear : globalYear),
    [localYear, globalYear]
  );

  useEffect(() => {
    if (localYear === globalYear) {
      setSelectedLocalYear("");
    }
  }, [localYear, globalYear, setSelectedLocalYear]);

  return { selectedYear, globalYear, localYear, setSelectedLocalYear };
};
