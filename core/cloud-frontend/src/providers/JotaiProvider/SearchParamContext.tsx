import { createContext } from "react";

export type SearchParamValueType =
  | string
  | number
  | null
  | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | any[]
  | Record<string, string | number | boolean | null>;
export type SearchParamType = Record<string, SearchParamValueType>;

export interface GlobalSearchParamState {
  [moduleName: string]: SearchParamType;
  portfolioAnalyticsNavFilters: SearchParamType;
  portfolioAnalytics: {
    datePeriod: "YTD" | "MTD" | "QTD";
    endDate: string;
    startDate: string;
  };
}

export type SearchParamKeys = keyof SearchParamType;
export type SearchParamValues<K extends SearchParamKeys> = SearchParamType[K];
export type ResetSearchParamType = ({
  moduleName,
  searchParamName,
}: {
  moduleName: keyof GlobalSearchParamState;
  searchParamName: SearchParamKeys;
}) => void;

export type ResetAllSearchParamsType = ({
  moduleName,
}: {
  moduleName: keyof GlobalSearchParamState;
}) => void;

export type SetSearchParamType = <K extends SearchParamKeys>({
  moduleName,
  searchParamName,
  value,
}: {
  moduleName: keyof GlobalSearchParamState;
  searchParamName: K;
  value: SearchParamValues<K>;
}) => void;

export interface SearchParamContextType {
  searchParamState: GlobalSearchParamState;
  setSearchParamState: React.Dispatch<
    React.SetStateAction<GlobalSearchParamState>
  >;
  handleResetSearchParam: ResetSearchParamType;
  handleResetAllSearchParams: ResetAllSearchParamsType;
  handleSetSearchParam: SetSearchParamType;
}

export const SearchParamContext = createContext<SearchParamContextType | null>(
  null
);

export const SearchParamsModules: {
  [K in keyof GlobalSearchParamState]: keyof GlobalSearchParamState;
} = {
  portfolioAnalyticsNavFilters: "portfolioAnalyticsNavFilters",
  portfolioAnalytics: "portfolioAnalytics",
};
