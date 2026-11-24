import { InstrumentGroupSortField } from "@/api/types";
import { InstrumentGroupDetail } from "@/api/types/instrumentGroupDetail";
import { SkeletonWrapper } from "@/components/SkeletonWrapper/SkeletonWrapper";
import { TextField } from "@/components/TextField";
import { InputAdornment } from "@/components/ui";
import { Pagination } from "@/components/Pagination";
import { Sort } from "@/typings/Sort";
import { InstrumentGroupItemResponse as Instrument } from "@/api/types";
import { debounce } from "@/utils";
import { useGetInstrumentGroups } from "@api/endpoints/instrument-group/instrument-group";
import { keepPreviousData } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { InstrumentGroupGrid } from "../InstrumentGroupGrid";
import { WidgetBody } from "@/components/Widget/WidgetBody";
import { WidgetHeader } from "@/components/Widget/WidgetHeader";
import { WidgetWrapper } from "@/components/Widget";

export interface InstrumentGroupSecurity {
  id: number;
  name: string;
  uniqueIds: string[];
  instruments?: Instrument[];
}

const transformData = (
  data: InstrumentGroupDetail[]
): InstrumentGroupSecurity[] => {
  return data.flatMap(({ id, name, instruments }) => {
    return [
      { id, name, uniqueIds: [id.toString()], instruments },
      ...instruments.map(({ id: instrumentId, name: instrumentName }) => ({
        id: instrumentId,
        name: instrumentName,
        uniqueIds: [id.toString(), instrumentId.toString()],
      })),
    ];
  });
};

const mapSortKey = (sort: Sort<InstrumentGroupSortField> | null) => {
  if ((sort?.key as string) === "ag-Grid-AutoColumn") return "name";

  return sort?.key || undefined;
};

export const InstrumentGroups = () => {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort<InstrumentGroupSortField> | null>(null);
  const [page, setPage] = useState(1);

  const updateSearch = useMemo(() => debounce(setSearch, 500), []);

  const { data, isLoading, isPlaceholderData } = useGetInstrumentGroups(
    {
      page: page,
      search,
      sort_by: mapSortKey(sort),
      sort_order: sort?.order ?? "asc",
    },
    {
      query: {
        placeholderData: keepPreviousData,
      },
    }
  );

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

  const formatedData = useMemo(() => transformData(securities), [securities]);

  return (
    <WidgetWrapper data-testid="instrument-groups-widget-wrapper">
      <WidgetHeader>
        <SkeletonWrapper
          isLoading={isLoading}
          skeletonClassName="h-7 w-[160px] m-2"
        >
          Instrument Groups ({data?.total})
        </SkeletonWrapper>
        <SkeletonWrapper
          isLoading={isLoading}
          skeletonClassName="h-7 w-[160px] m-2"
        >
          <TextField
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

      <WidgetBody data-testid="instrument-groups-table-body">
        <InstrumentGroupGrid
          page={page}
          totalPages={totalPages}
          rows={formatedData}
          isLoading={isLoading}
          isPlaceholderData={isPlaceholderData}
          sort={sort}
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
