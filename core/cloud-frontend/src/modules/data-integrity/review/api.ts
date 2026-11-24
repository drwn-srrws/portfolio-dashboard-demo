/**
 * Data Integrity review API (reference).
 *
 * Hand-written, feature-local client over the shared axios `customInstance`
 * + react-query — intentionally NOT routed through the orval-generated client
 * so this feature doesn't require regenerating the whole committed API client.
 * Mirrors the backend router at `core/portfolio/core/routers/data_integrity`.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { customInstance } from "@api/mutator/custom-instance";

// The generated client bakes the `/api/dev` version prefix into every path
// (see src/api/endpoints/*). Match it so requests hit the same gateway route.
const API_PREFIX = "/api/dev/data-integrity";

export type ReviewDecisionStatus = "OPEN" | "VALID";

export interface FlagOut {
  id: number;
  check_type: string;
  status: string;
  flag_date: string;
  metric_value: number;
  fund_id: number | null;
  fund_name: string | null;
  instrument_id: number | null;
  instrument_name: string | null;
  enfusion_id: number | null;
  security_code: string | null;
  pnl_value: number | null;
  exposure_value: number | null;
  nav_value: number | null;
  enfusion_price: number | null;
  bloomberg_price: number | null;
  context: Record<string, unknown> | null;
}

export interface CheckGroup {
  check_type: string;
  title: string;
  open_count: number;
  flags: FlagOut[];
}

export interface RunFlagsResponse {
  run_id: number;
  run_date: string;
  status: string;
  total_open: number;
  checks: CheckGroup[];
}

export interface FlagDecision {
  flag_id: number;
  status: ReviewDecisionStatus;
}

export interface AcknowledgeResponse {
  updated: number;
  acknowledged_by_id: number;
  skipped_ids: number[];
}

// The review is not run-scoped: the backend returns all currently-OPEN flags
// (a flag is attributed to the run it first appeared in, but stays actionable
// until acknowledged). The daily email links to /data-integrity/review.
export const getRunFlags = () =>
  customInstance<RunFlagsResponse>({
    url: `${API_PREFIX}/runs/latest`,
    method: "GET",
  });

export const acknowledgeFlags = (decisions: FlagDecision[]) =>
  customInstance<AcknowledgeResponse>({
    url: `${API_PREFIX}/flags/acknowledge`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: { decisions },
  });

export const runFlagsQueryKey = ["data-integrity", "run", "latest"] as const;

export const useRunFlags = () =>
  useQuery({
    queryKey: runFlagsQueryKey,
    queryFn: getRunFlags,
    // Single-session review workflow — don't refetch on every window-focus
    // (alt-tab) during a review; the run stays fixed until the next daily run.
    staleTime: 5 * 60 * 1000,
  });

export const useAcknowledgeFlags = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acknowledgeFlags,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: runFlagsQueryKey }),
  });
};
