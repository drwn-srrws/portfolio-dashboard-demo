import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

import {
  getAlphaAnalystBreakdownStatsEndpoint,
  getGetAlphaAnalystBreakdownConfigEndpointQueryKey,
} from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import type {
  GetAlphaAnalystBreakdownStatsEndpointParams,
  HTTPValidationError,
  TeamAnalystBreakdownRequest,
  TeamAnalystBreakdownResponse,
} from "@/api/types";
import type { ErrorType } from "@/api/mutator/custom-instance";

interface UseAlphaAnalystBreakdownDataParams {
  payload: TeamAnalystBreakdownRequest;
  params?: GetAlphaAnalystBreakdownStatsEndpointParams;
  enabled: boolean;
}

const getQueryKey = (
  payload: TeamAnalystBreakdownRequest,
  params?: GetAlphaAnalystBreakdownStatsEndpointParams
) =>
  [
    `/api/dev/portfolio-metrics/alpha-analyst-breakdown`,
    ...(params ? [params] : []),
    payload,
    // invalidate when config changes, since config can affect supported display columns
    getGetAlphaAnalystBreakdownConfigEndpointQueryKey(),
  ] as const;

export const useAlphaAnalystBreakdownData = <
  TData = TeamAnalystBreakdownResponse,
  TError = ErrorType<HTTPValidationError>,
>(
  { payload, params, enabled }: UseAlphaAnalystBreakdownDataParams,
  options?: {
    query?: Partial<
      UseQueryOptions<TeamAnalystBreakdownResponse, TError, TData>
    >;
  }
): UseQueryResult<TData, TError> => {
  const queryKey = useMemo(
    () => getQueryKey(payload, params),
    [payload, params]
  );

  const queryFn = useCallback(
    async () => await getAlphaAnalystBreakdownStatsEndpoint(payload, params),
    [payload, params]
  );

  return useQuery({
    queryKey,
    queryFn,
    enabled,
    ...(options?.query ?? {}),
  });
};
