import { ReactNode, useCallback, useMemo, useState } from "react";
import { Filters } from "@typings/Filters";
import { FiltersContext } from "./FiltersContext";

export interface FiltersProviderProps {
  children?: ReactNode;
  defaultFilters?: Filters;
}

export const FiltersProvider = ({
  children,
  defaultFilters,
}: FiltersProviderProps) => {
  const [filters, setFilters] = useState<Filters>(defaultFilters ?? {});

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters ?? {});
  }, [defaultFilters, setFilters]);

  const context = useMemo(
    () => ({ filters, setFilters, resetFilters }),
    [filters, resetFilters, setFilters]
  );

  return (
    <FiltersContext.Provider value={context}>
      {children}
    </FiltersContext.Provider>
  );
};
