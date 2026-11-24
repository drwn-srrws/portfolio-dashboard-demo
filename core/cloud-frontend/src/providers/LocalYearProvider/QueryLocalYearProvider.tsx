import { PropsWithChildren, useCallback, useMemo } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { LocalYearContext } from "./LocalYearContext";
import { usePanel } from "../PanelProvider";

export interface QueryLocalYearProviderProps {
  defaultYear?: string;
}

export const QueryLocalYearProvider = ({
  defaultYear = "",
  children,
}: PropsWithChildren<QueryLocalYearProviderProps>) => {
  const {
    api: { id: panelId },
  } = usePanel();

  const [selectedYear, setSelectedYearState] = useQueryState(
    `${panelId}-local-year`,
    parseAsString.withDefault(defaultYear)
  );

  const setSelectedYear = useCallback(
    (year: string | null) => {
      setSelectedYearState(year);
    },
    [setSelectedYearState]
  );

  const value = useMemo(
    () => ({
      selectedYear,
      setSelectedYear,
    }),
    [selectedYear, setSelectedYear]
  );

  return (
    <LocalYearContext.Provider value={value}>
      {children}
    </LocalYearContext.Provider>
  );
};
