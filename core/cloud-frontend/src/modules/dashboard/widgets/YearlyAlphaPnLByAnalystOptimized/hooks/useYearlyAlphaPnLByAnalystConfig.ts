import { useMemo } from "react";

import { useGetLtdAlphaYearlyAlphaPerfConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import type { FilterBenchmarkCombo } from "@/api/types";

import { matchBenchmarkCombo } from "../YearlyAlphaPnLByAnalystTable.utils";

export interface YearlyAlphaPnLByAnalystConfig {
  supportedFilters: string[];
  displayNameMap: Record<string, string>;
  matchedCombo: FilterBenchmarkCombo | null;
  /** Benchmarks available in the dropdown — combo-scoped when matched, otherwise the global list. */
  benchmarkIds: string[];
  /** Pre-selected benchmark from the matched combo's default_benchmark_id. */
  defaultBenchmarkId: string | null;
  /** benchmark_id -> display_name lookup from the config endpoint. */
  benchmarks: Record<string, string>;
}

const FALLBACK_CONFIG: YearlyAlphaPnLByAnalystConfig = {
  supportedFilters: [],
  displayNameMap: {},
  matchedCombo: null,
  benchmarkIds: [],
  defaultBenchmarkId: null,
  benchmarks: {},
};

/**
 * Config hook for analyst-grouped Yearly Alpha PnL cards.
 *
 * Resolves the FilterBenchmarkCombo whose ``filters`` match the card's
 * hardcoded scope (portfolio_team + fund_name) and exposes that combo's
 * ``benchmark_ids`` + ``default_benchmark_id`` for the benchmark dropdown.
 */
export const useYearlyAlphaPnLByAnalystConfig = (
  defaultFilters: Record<string, string[]>
) => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetLtdAlphaYearlyAlphaPerfConfigEndpoint();

  const config: YearlyAlphaPnLByAnalystConfig = useMemo(() => {
    if (!configData) return FALLBACK_CONFIG;

    const matchedCombo = matchBenchmarkCombo(
      configData.default_filter_benchmark_combos,
      defaultFilters
    );

    const benchmarkIds =
      matchedCombo?.benchmark_ids ?? configData.benchmark_ids ?? [];
    const defaultBenchmarkId =
      matchedCombo?.default_benchmark_id ?? benchmarkIds[0] ?? null;

    return {
      supportedFilters: configData.metadata?.supported_filters ?? [],
      displayNameMap: configData.metadata?.display_name_map ?? {},
      matchedCombo,
      benchmarkIds,
      defaultBenchmarkId,
      benchmarks: configData.benchmarks ?? {},
    };
  }, [configData, defaultFilters]);

  return { config, isLoading, isError };
};
