import { ReactNode, useCallback, useMemo, useState } from "react";
import { Filters } from "@typings/Filters";
import { FiltersContext } from "./LocalFiltersContext";

export interface LocalFiltersProviderProps {
  children?: ReactNode;
  defaultFilters?: Filters;
}

export const LocalFiltersProvider = ({
  children,
  defaultFilters,
}: LocalFiltersProviderProps) => {
  const [filters, setFilters] = useState<Filters>(defaultFilters ?? {});

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters ?? {});
  }, [defaultFilters, setFilters]);

  const value = useMemo(
    () => ({ filters, setFilters, resetFilters }),
    [filters, resetFilters, setFilters]
  );

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
};
