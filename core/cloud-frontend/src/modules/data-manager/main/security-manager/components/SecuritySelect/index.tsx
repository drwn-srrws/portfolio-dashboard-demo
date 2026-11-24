import { useCallback, useMemo, useState } from "react";
import { debounce } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { CompanyInstrumentResponse as Instrument } from "@api/types";
import {
  InfiniteMultiSelect,
  InfiniteMultiSelectProps,
} from "../InfiniteScrollMultiSelect/InfiniteMultiSelect";
import { useInfiniteInstruments } from "../../hooks/useInfiniteInstruments";

export interface SecuritySelectProps
  extends Omit<InfiniteMultiSelectProps, "options"> {
  withNoInstrumentGroup?: boolean;
  withNoCompany?: boolean;
  prefilledSecurities?: Instrument[];
  maxBadgesDisplayed?: number;
}

export const SecuritySelect = ({
  withNoInstrumentGroup = false,
  withNoCompany = false,
  prefilledSecurities = [],
  maxBadgesDisplayed,
  ...props
}: SecuritySelectProps) => {
  const queryClient = useQueryClient();

  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQuery, _setSearchQuery] = useState("");

  const {
    data: infiniteSecuritiesResponse,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteInstruments({
    search: searchQuery,
    exclude_ids: prefilledSecurities.map((instrument) => instrument.id),
    without_instrument_group: withNoInstrumentGroup,
    without_issuer: withNoCompany,
  });

  const securities = useMemo(() => {
    const filteredPrefilledSecurities = prefilledSecurities.filter(
      (instrument) =>
        instrument.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const infiniteSecurities =
      infiniteSecuritiesResponse?.pages.flatMap((page) => page.items) ?? [];

    return [...filteredPrefilledSecurities, ...infiniteSecurities];
  }, [prefilledSecurities, infiniteSecuritiesResponse, searchQuery]);

  const options = useMemo(() => {
    return securities.map((security) => ({
      value: `${security.id}`,
      label: security.name,
    }));
  }, [securities]);

  const setSearchQuery = useMemo(
    () =>
      debounce((value: string) => {
        queryClient.removeQueries({ queryKey: ["instruments"] });
        _setSearchQuery(value);
      }, 300),
    [queryClient]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInputValue(value);
      setSearchQuery(value);
    },
    [setSearchInputValue, setSearchQuery]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <InfiniteMultiSelect
      maxBadgesDisplayed={maxBadgesDisplayed}
      {...props}
      options={options}
      search={searchInputValue}
      isLoadingOptions={isFetchingNextPage && !options?.length}
      isLoadingMore={isFetchingNextPage}
      onLoadMore={handleLoadMore}
      onSearchChange={handleSearchChange}
    />
  );
};
