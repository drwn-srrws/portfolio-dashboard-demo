import { ReactNode, useCallback, useMemo } from "react";
import { parseAsJson, useQueryState } from "nuqs";
import { z } from "zod";
import { Filters } from "@typings/Filters";
import { FiltersContext } from "./LocalFiltersContext";
import { usePanel } from "../PanelProvider";

const localFiltersSchema = z.record(
  z.string(),
  z.array(z.union([z.string(), z.number(), z.boolean()]))
);

export interface QueryLocalFiltersProviderProps {
  children?: ReactNode;
  defaultFilters?: Filters;
}

export const QueryLocalFiltersProvider = ({
  children,
  defaultFilters,
}: QueryLocalFiltersProviderProps) => {
  const {
    api: { id: panelId },
  } = usePanel();

  const [filters, setFilters] = useQueryState<Filters>(
    `${panelId}-local-filters`,
    parseAsJson(localFiltersSchema.parse).withDefault(defaultFilters ?? {})
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters ?? {});
  }, [defaultFilters, setFilters]);

  const value = useMemo(
    () => ({ filters, resetFilters, setFilters }),
    [filters, resetFilters, setFilters]
  );

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
};
