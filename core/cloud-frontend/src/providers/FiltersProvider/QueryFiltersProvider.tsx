import { ReactNode, useCallback, useMemo } from "react";
import { z } from "zod";
import { parseAsJson, useQueryState } from "nuqs";
import { Filters } from "@typings/Filters";
import { FiltersContext } from "./FiltersContext";

const filtersSchema = z.record(
  z.string(),
  z.array(z.union([z.string(), z.number(), z.boolean()]))
);

export interface QueryFiltersProviderProps {
  children?: ReactNode;
  defaultFilters?: Filters;
}

export const QueryFiltersProvider = ({
  children,
  defaultFilters,
}: QueryFiltersProviderProps) => {
  const [filters, setFilters] = useQueryState<Filters>(
    "filters",
    parseAsJson(filtersSchema.parse).withDefault(defaultFilters ?? {})
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters ?? {});
  }, [defaultFilters, setFilters]);

  const context = useMemo(
    () => ({ filters, resetFilters, setFilters }),
    [filters, resetFilters, setFilters]
  );

  return (
    <FiltersContext.Provider value={context}>
      {children}
    </FiltersContext.Provider>
  );
};
