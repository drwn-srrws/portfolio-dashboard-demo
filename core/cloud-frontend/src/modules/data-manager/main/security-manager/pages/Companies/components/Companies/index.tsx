import {
  CompanyResponse as Company,
  CompanyInstrumentResponse as Instrument,
  CompanySort,
} from "@/api/types";
import { SkeletonWrapper } from "@/components/SkeletonWrapper/SkeletonWrapper";
import { TextField } from "@/components/TextField";
import { InputAdornment } from "@/components/ui";
import { Sort } from "@/typings/Sort";
import { debounce } from "@/utils";
import { Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { CompanyGrid } from "../CompanyGrid";
import { Pagination } from "@/components/Pagination";
import { WidgetBody } from "@/components/Widget/WidgetBody";
import { WidgetWrapper } from "@/components/Widget/WidgetWrapper";
import { WidgetHeader } from "@/components/Widget";
import { useCompanies } from "../../hooks/useCompanies";

export interface CompanySecurity {
  id: string;
  name: string;
  uniqueIds: string[];
  instruments?: Instrument[];
}

const transformData = (data: Company[]): CompanySecurity[] => {
  return data.map(({ id, name, instruments }) => {
    const instrumentsArray = instruments ?? [];
    return {
      id: id.toString(),
      name,
      uniqueIds: [id.toString()],
      instruments: instrumentsArray as Instrument[],
    };
  });
};

const mapSortKey = (sort: Sort<CompanySort> | null) => {
  if (!sort) return "name";

  if ((sort?.key as string) === "ag-Grid-AutoColumn") return "name";

  return sort?.key || undefined;
};

export const Companies = () => {
  const [page, setPage] = useState(1);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort<CompanySort> | null>(null);

  const { data, isLoading, isPlaceholderData } = useCompanies({
    page,
    pageSize: 50,
    sortBy: mapSortKey(sort),
    sortOrder: sort?.order ?? "asc",
    search,
  });

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

  const formatedData = useMemo(() => transformData(securities), [securities]);

  return (
    <WidgetWrapper>
      <WidgetHeader>
        <SkeletonWrapper
          isLoading={isLoading}
          skeletonClassName="h-7 w-[160px] mb-2"
        >
          Companies ({data?.total})
        </SkeletonWrapper>

        <SkeletonWrapper
          isLoading={isLoading}
          skeletonClassName="h-7 w-[160px] mb-2"
        >
          <TextField
            testId="companies-search-input"
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

      <WidgetBody data-testid="coverage-universe-table-body">
        <CompanyGrid
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
