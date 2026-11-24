import { useAtom, Provider } from "jotai";
import { atomWithHash } from "jotai-location";
import { RESET } from "jotai/utils";
import { FC, PropsWithChildren, useCallback } from "react";
import {
  GlobalSearchParamState,
  SearchParamContext,
  SearchParamKeys,
  SearchParamType,
  SearchParamValues,
} from "./SearchParamContext";

const locationAtom = atomWithHash(
  "globalSearchParams",
  {} as GlobalSearchParamState
);

export const JotaiProvider: FC<PropsWithChildren> = ({ children }) => {
  const [searchParamState, setSearchParamState] = useAtom(locationAtom);

  const handleResetSearchParam = useCallback(
    ({
      moduleName,
      searchParamName,
    }: {
      moduleName: keyof GlobalSearchParamState;
      searchParamName: SearchParamKeys;
    }) => {
      setSearchParamState((prev) => ({
        ...prev,
        [moduleName]: {
          ...prev[moduleName],
          [searchParamName]: null,
        },
      }));
    },
    [setSearchParamState]
  );

  const handleResetAllSearchParams = useCallback(
    ({ moduleName }: { moduleName: keyof GlobalSearchParamState }) => {
      setSearchParamState((prev) => ({
        ...prev,
        [moduleName]: RESET as unknown as SearchParamType,
      }));
    },
    [setSearchParamState]
  );

  const handleSetSearchParam = useCallback(
    <K extends SearchParamKeys>({
      moduleName,
      searchParamName,
      value,
    }: {
      moduleName: keyof GlobalSearchParamState;
      searchParamName: K;
      value: SearchParamValues<K>;
    }) => {
      setSearchParamState((prev) => ({
        ...prev,
        [moduleName]: {
          ...prev[moduleName],
          [searchParamName]: value,
        },
      }));
    },
    [setSearchParamState]
  );

  return (
    <Provider>
      <SearchParamContext.Provider
        value={{
          searchParamState,
          setSearchParamState,
          handleSetSearchParam,
          handleResetSearchParam,
          handleResetAllSearchParams,
        }}
      >
        {children}
      </SearchParamContext.Provider>
    </Provider>
  );
};
