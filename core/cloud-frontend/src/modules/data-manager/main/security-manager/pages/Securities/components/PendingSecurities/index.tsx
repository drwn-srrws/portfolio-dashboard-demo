import { prop, sortBy } from "ramda";
import { SkeletonWrapper } from "@/components/SkeletonWrapper/SkeletonWrapper";
import { TextField } from "@/components/TextField";
import { InputAdornment } from "@/components/ui";
import { Sort } from "@/typings/Sort";
import { debounce } from "@/utils";
import { useGetInstruments } from "@api/endpoints/instrument/instrument";
import { keepPreviousData } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { SecurityGrid } from "../SecurityGrid";

import { WidgetWrapper } from "@/components/Widget/WidgetWrapper";
import { Pagination } from "@/components/Pagination";
import {
  InstrumentSortField,
  instrumentSortFields,
} from "../../../../types/InstrumentSortField";
import { WidgetHeader } from "@/components/Widget/WidgetHeader";
import { WidgetBody } from "@/components/Widget/WidgetBody";

export const PendingSecurities = () => {
  const [sort, setSort] = useState<Sort<InstrumentSortField> | null>(null);

  const [page, setPage] = useState(1);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [search, setSearch] = useState("");

  const updateSearch = useMemo(() => debounce(setSearch, 500), []);

  const isSortableField = useMemo(() => {
    if (!sort) return false;
    return instrumentSortFields.includes(sort.key);
  }, [sort]);

  const { data, isLoading, isPlaceholderData } = useGetInstruments(
    {
      search,
      sort_by: isSortableField ? sort?.key : "updated_at_utc",
      sort_order: isSortableField ? sort?.order : "desc",
      publish_status: ["not_published", "internally_published"],
      without_enfusion: false,
      page,
    },
    { query: { placeholderData: keepPreviousData } }
  );

  const securities = useMemo(() => {
    const securities = data?.items ?? [];
    if (!sort || isSortableField) return securities;
    const sortedSecurities = sortBy(prop(sort.key))(securities);
    if (sort.order === "asc") return sortedSecurities;
    return sortedSecurities.reverse();
  }, [data, isSortableField, sort]);

  const totalPages = useMemo(() => data?.total_pages ?? 0, [data]);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchInputValue(value);
      updateSearch(value);
      setPage(1);
    },
    [updateSearch]
  );

  return (
    <WidgetWrapper>
      <WidgetHeader>
        <SkeletonWrapper
          isLoading={isLoading}
          skeletonClassName="h-7 w-[160px]"
        >
          Pending Securities ({data?.total})
        </SkeletonWrapper>
        <SkeletonWrapper
          isLoading={isLoading}
          skeletonClassName="h-7 w-[160px]"
        >
          <TextField
            testId="pending-securities-search-input"
            placeholder="Search"
            value={searchInputValue}
            startAdornment={
              <InputAdornment variant="transparent">
                <Search className="size-5" />
              </InputAdornment>
            }
            onChange={handleSearch}
          />
        </SkeletonWrapper>
      </WidgetHeader>

      <WidgetBody>
        <SecurityGrid
          testId="pending-securities-table"
          page={page}
          sort={sort}
          totalPages={totalPages}
          rows={securities}
          isPlaceholderData={isPlaceholderData}
          isLoading={isLoading}
          onSortChange={setSort}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </WidgetBody>
    </WidgetWrapper>
  );
};
