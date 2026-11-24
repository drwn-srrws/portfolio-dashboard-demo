import { createContext, useContext } from "react";
import { Filters } from "@typings/Filters";

export type IFiltersContext = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
};

export const FiltersContext = createContext<IFiltersContext>({
  filters: {},
  setFilters: () => {},
  resetFilters: () => {},
});

export const useFilters = () => useContext(FiltersContext);
