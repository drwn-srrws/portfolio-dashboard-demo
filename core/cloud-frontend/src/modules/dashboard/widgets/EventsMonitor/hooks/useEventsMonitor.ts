import {
  CompanyFilterField,
  CompanyListRequest,
  CompanyLogicalFilterFiltersItem,
  ComparisonOperator,
  LogicalOperator,
} from "@/api/types";
import { useListEventTracker } from "@/hooks/api/useListEventTracker";
import { mapFiltersToCompanyFilters } from "../../CoverageUniverse/helpers/filters";
import { Filters } from "@/typings/Filters";
import { keepPreviousData } from "@tanstack/react-query";

export type UseEventsMonitorOptions = CompanyListRequest & {
  searchQuery: string;
  defaultFilters: CompanyLogicalFilterFiltersItem[];
  sharedFilters: Filters;
  with_events?: boolean;
  invalidate_cache?: boolean;
  enabled?: boolean;
};
export const useEventsMonitor = (options: UseEventsMonitorOptions) => {
  const {
    page = 1,
    page_size = 100,
    sort_by,
    sort_order = "asc",
    includes = [],
    searchQuery,
    defaultFilters = [],
    sharedFilters,
    with_events,
    invalidate_cache = false,
    enabled = true,
  } = options;

  const request: CompanyListRequest = {
    page,
    page_size,
    sort_by,
    sort_order,
    includes,
    filter: {
      op: LogicalOperator.and,
      filters: [
        ...defaultFilters,
        ...(sharedFilters ? mapFiltersToCompanyFilters(sharedFilters) : []),
        ...(searchQuery
          ? [
              {
                op: LogicalOperator.or,
                filters: [
                  {
                    field: CompanyFilterField.name,
                    op: ComparisonOperator.icontains,
                    value: searchQuery,
                  },
                  {
                    field: CompanyFilterField.primary_instrumentticker,
                    op: ComparisonOperator.icontains,
                    value: searchQuery,
                  },
                  {
                    field: CompanyFilterField.primary_instrumentbbg_yellow_key,
                    op: ComparisonOperator.icontains,
                    value: searchQuery,
                  },
                ],
              },
            ]
          : []),
      ],
    },
    ...(with_events && { with_events: true }),
  };

  const query = useListEventTracker(request, {
    query: {
      placeholderData: keepPreviousData,
      enabled: enabled,
    },
    request: {
      params: {
        invalidate_cache,
      },
    },
  });

  return { ...query, request };
};
