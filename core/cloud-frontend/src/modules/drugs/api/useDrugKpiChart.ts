import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getDrugKpiChart } from "@api/endpoints/drugs/drugs";
import type { ChartRequest, ChartResponse } from "@api/types";

/**
 * The Paid TRx chart endpoint is generated as a POST mutation, but the UI needs
 * it to behave reactively (refetch when the drug, timeframe, or STLY toggle
 * changes). This thin wrapper drives the generated request function through
 * `useQuery` with a stable key derived from the request body.
 */
export const useDrugKpiChart = (
  request: ChartRequest,
  options?: { enabled?: boolean }
) =>
  useQuery<ChartResponse>({
    queryKey: ["drugs", "kpi-chart", request],
    queryFn: ({ signal }) => getDrugKpiChart(request, undefined, signal),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
