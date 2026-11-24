import { createContext, useContext } from "react";
import { Filters } from "@typings/Filters";

export type ILocalFiltersContext = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
};

export const FiltersContext = createContext<ILocalFiltersContext>({
  filters: {},
  setFilters: () => {},
  resetFilters: () => {},
});

export const useLocalFilters = () => useContext(FiltersContext);
