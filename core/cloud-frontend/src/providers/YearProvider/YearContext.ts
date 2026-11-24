import { createContext, useContext } from "react";

export type IYearContext = {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
};

export const YearContext = createContext<IYearContext>({
  selectedYear: "",
  setSelectedYear: () => {},
});

export const useYear = () => useContext(YearContext);
