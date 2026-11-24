import { useMemo } from "react";
import { useGetHistPerfMonthlyAlphaPerfConfigEndpoint } from "@/api/endpoints/portfolio-metrics/portfolio-metrics";
import { HistPerfMonthlyAlphaPerfVariant } from "@/api/types/histPerfMonthlyAlphaPerfVariant";
import { Filters } from "@/typings/Filters";

export interface HistoricalMonthlyAlphaPerfConfig {
  supportedFilters: string[];
  benchmarkId: string;
  groupByOptions: string[];
  defaultGroupBy: string;
  benchmarks: Record<string, string>;
}

const FALLBACK_CONFIG: HistoricalMonthlyAlphaPerfConfig = {
  supportedFilters: [],
  benchmarkId: "",
  groupByOptions: [],
  defaultGroupBy: "fund_name",
  benchmarks: {},
};

function variantMatchesFilters(
  variant: HistPerfMonthlyAlphaPerfVariant,
  activeFilters: Filters
): boolean {
  return Object.entries(variant.filters).every(([key, value]) => {
    const active = activeFilters[key];
    if (!Array.isArray(active) || active.length === 0) return false;
    const required = Array.isArray(value) ? value : [value];
    return required.every((v) =>
      active.includes(v as string | number | boolean)
    );
  });
}

export const useHistoricalMonthlyAlphaPerfConfig = (filters?: Filters) => {
  const {
    data: configData,
    isLoading,
    isError,
  } = useGetHistPerfMonthlyAlphaPerfConfigEndpoint();

  const config: HistoricalMonthlyAlphaPerfConfig = useMemo(() => {
    if (!configData) return FALLBACK_CONFIG;

    const defaultBenchmarkId = configData.metadata?.benchmark_id || "";

    let benchmarkId = defaultBenchmarkId;
    if (filters && configData.variants?.length) {
      const matched = configData.variants.find((variant) =>
        variantMatchesFilters(variant, filters)
      );
      if (matched?.benchmark_id != null) {
        benchmarkId = matched.benchmark_id;
      }
    }

    return {
      supportedFilters: configData.metadata?.supported_filters || [],
      benchmarkId,
      groupByOptions:
        configData.metadata?.group_by_config?.selectable_dimensions || [],
      defaultGroupBy:
        configData.metadata?.group_config_default?.selectable_dimensions?.[0] ||
        "fund_name",
      benchmarks: configData.benchmarks ?? {},
    };
  }, [configData, filters]);

  return { config, isLoading, isError };
};
