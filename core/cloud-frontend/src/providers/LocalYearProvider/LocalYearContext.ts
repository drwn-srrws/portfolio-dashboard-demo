import { createContext, useContext } from "react";

export type ILocalYearContext = {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
};

export const LocalYearContext = createContext<ILocalYearContext>({
  selectedYear: "",
  setSelectedYear: () => {},
});

export const useLocalYear = () => useContext(LocalYearContext);
