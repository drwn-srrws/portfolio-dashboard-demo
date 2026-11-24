import { useMemo } from "react";

import { useGetPortfolioMetricsCatalog } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import type {
  GetPortfolioMetricsCatalogParams,
  MetricMetadata,
  CatalogResponseBenchmarks,
  HTTPValidationError,
} from "@/api/types";
import type { ErrorType } from "@/api/mutator/custom-instance";

export type MetricCatalogV3 = MetricMetadata & {
  benchmarks?: CatalogResponseBenchmarks;
};

type V3CatalogQuery = ReturnType<typeof useGetPortfolioMetricsCatalog> & {
  data: MetricCatalogV3 | undefined;
  error: ErrorType<HTTPValidationError> | null;
};

/**
 * Backwards-compatible wrapper that sources data from the new
 * `/portfolio-metrics/catalog` endpoint and adapts the response back to the
 * legacy V3 shape (`filterable_by` / `filterable_values`) so existing call
 * sites keep working without changes. The legacy `groupable_by` field is no
 * longer returned by the backend.
 */
export function useGetPortfolioMetricCatalogV3(
  params?: GetPortfolioMetricsCatalogParams
): V3CatalogQuery {
  const query = useGetPortfolioMetricsCatalog(params);

  const adaptedData = useMemo<MetricCatalogV3 | undefined>(() => {
    if (!query.data) return undefined;
    return {
      metrics: query.data.metrics,
      filterable_by: query.data.filters.map((filter) => ({
        ...filter,
        filterable_values: filter.values,
      })),
      benchmarks: query.data.benchmarks,
    } as MetricCatalogV3;
  }, [query.data]);

  return {
    ...query,
    data: adaptedData,
  } as unknown as V3CatalogQuery;
}

export { getPortfolioMetricsCatalog as getPortfolioMetricCatalogV3 } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
