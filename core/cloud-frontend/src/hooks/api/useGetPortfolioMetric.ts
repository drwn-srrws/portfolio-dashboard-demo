import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import {
  getGetPortfolioMetricsQueryOptions,
  getPortfolioMetrics,
} from "@/api/endpoints/portfolio/portfolio";
import type {
  GetPortfolioMetricsParams,
  MetricRequest,
  HTTPValidationError,
} from "@/api/types";
import type { ErrorType } from "@/api/mutator/custom-instance";
import { customInstance } from "@/api/mutator/custom-instance";
import { useInvalidateCacheFlag } from "@/hooks/useInvalidateCacheFlag";
import type { MetricFlags } from "@/typings/MetricFlags";

type PortfolioMetricsParams = GetPortfolioMetricsParams & Partial<MetricFlags>;

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

const BOOL_MAP: Record<string, boolean> = { true: true, false: false };

const normalizeFilters = (requests: MetricRequest[]) =>
  requests.map((req) => {
    if (!req.filters) return req;
    const filters = Object.fromEntries(
      Object.entries(req.filters).map(([k, v]) => [
        k,
        v.map((val) =>
          typeof val === "string" && val.toLowerCase() in BOOL_MAP
            ? BOOL_MAP[val.toLowerCase()]
            : val
        ),
      ])
    );
    return { ...req, filters };
  });

export function useGetPortfolioMetricsV3<
  TData = Awaited<ReturnType<typeof getPortfolioMetrics>>,
  TError = ErrorType<HTTPValidationError>,
>(
  metricRequests: MetricRequest[],
  params: PortfolioMetricsParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getPortfolioMetrics>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getPortfolioMetrics>>,
          TError,
          Awaited<ReturnType<typeof getPortfolioMetrics>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customInstance>;
  }
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetPortfolioMetricsV3<
  TData = Awaited<ReturnType<typeof getPortfolioMetrics>>,
  TError = ErrorType<HTTPValidationError>,
>(
  metricRequests: MetricRequest[],
  params?: PortfolioMetricsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getPortfolioMetrics>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getPortfolioMetrics>>,
          TError,
          Awaited<ReturnType<typeof getPortfolioMetrics>>
        >,
        "initialData"
      >;
    request?: SecondParameter<typeof customInstance>;
  }
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
export function useGetPortfolioMetricsV3<
  TData = Awaited<ReturnType<typeof getPortfolioMetrics>>,
  TError = ErrorType<HTTPValidationError>,
>(
  metricRequests: MetricRequest[],
  params?: PortfolioMetricsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getPortfolioMetrics>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customInstance>;
  }
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
};
/**
 * @summary Get Portfolio Metrics V3
 * Wrapper hook that automatically adds invalidate_cache parameter from URL query string
 * and normalizes filter values (converts string "true"/"false" to actual booleans).
 */
export function useGetPortfolioMetricsV3<
  TData = Awaited<ReturnType<typeof getPortfolioMetrics>>,
  TError = ErrorType<HTTPValidationError>,
>(
  metricRequests: MetricRequest[],
  params?: PortfolioMetricsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getPortfolioMetrics>>,
        TError,
        TData
      >
    >;
    request?: SecondParameter<typeof customInstance>;
  }
): UseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData, TError>;
} {
  const invalidateCacheFromUrl = useInvalidateCacheFlag();

  const normalizedRequests = useMemo(
    () => normalizeFilters(metricRequests),
    [metricRequests]
  );

  const enhancedParams: PortfolioMetricsParams =
    params?.invalidate_cache !== undefined
      ? params
      : { ...params, invalidate_cache: invalidateCacheFromUrl };

  const queryOptions = getGetPortfolioMetricsQueryOptions(
    normalizedRequests,
    enhancedParams as GetPortfolioMetricsParams,
    options
  );

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}
