import { useCallback, useMemo, useState } from "react";
import { useGetInstruments } from "@api/endpoints/instrument/instrument";
import { SecurityGrid } from "../SecurityGrid";
import { keepPreviousData } from "@tanstack/react-query";
import { TextField } from "@/components/TextField";
import { InputAdornment } from "@/components/ui";
import { Search } from "lucide-react";
import { debounce } from "@/utils";
import { Sort } from "@/typings/Sort";
import { InstrumentSortField } from "@/api/types";
import { SkeletonWrapper } from "@/components/SkeletonWrapper/SkeletonWrapper";
import { WidgetWrapper } from "@/components/Widget/WidgetWrapper";
import { Pagination } from "@components/Pagination";
import { WidgetHeader } from "@/components/Widget/WidgetHeader";
import { WidgetBody } from "@/components/Widget/WidgetBody";

export const ExternallyPublishedSecurities = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<Sort<InstrumentSortField> | null>(null);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, isPlaceholderData } = useGetInstruments(
    {
      search,
      sort_by: sort?.key ?? "updated_at_utc",
      sort_order: sort?.order ?? "desc",
      publish_status: ["externally_published"],
      without_enfusion: false,
      page,
    },
    { query: { placeholderData: keepPreviousData } }
  );

  const updateSearch = useMemo(() => debounce(setSearch, 500), []);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchInputValue(value);
      updateSearch(value);
      setPage(1);
    },
    [updateSearch, setPage]
  );

  const securities = useMemo(() => data?.items ?? [], [data]);
  const totalPages = useMemo(() => data?.total_pages ?? 0, [data]);

  return (
    <WidgetWrapper>
      <WidgetHeader>
        <SkeletonWrapper
          isLoading={isLoading}
          skeletonClassName="h-7 w-[230px]"
        >
          Externally Published Securities ({data?.total})
        </SkeletonWrapper>

        <SkeletonWrapper
          isLoading={isLoading}
          skeletonClassName="h-7 w-[160px]"
        >
          <TextField
            testId="externally-published-securities-search-input"
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
          testId="externally-published-securities-table"
          disableStatus
          disableProgress
          disablePublish
          page={page}
          sort={sort}
          isPlaceholderData={isPlaceholderData}
          totalPages={totalPages}
          rows={securities}
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
