import { GetAlphaAnalysisStats200 } from "@api/types";

export interface AlphaAnalysisRow {
  fund_name?: string | null;
  uniqueIds: string[];
  [key: string]: unknown;
}

export const getMetricsForGroupBy = (
  groupBy: string,
  filters: Record<string, (string | number | boolean)[]>,
  defaultMetrics: Record<string, string[]>
): string[] => {
  if (groupBy === "fund_name") {
    const fundRelatedFilters = ["fund_name", "fund_id"];
    const appliedFilters = Object.keys(filters).filter(
      (filterKey) => filters[filterKey]?.length > 0
    );
    const hasNonFundFilters = appliedFilters.some(
      (filterKey) => !fundRelatedFilters.includes(filterKey)
    );

    if (hasNonFundFilters) {
      return [
        "cumulative_group_pnl_percent",
        "cumulative_benchmark_pnl_percent",
        "cumulative_alpha_pnl_percent",
      ];
    }
  }

  return defaultMetrics[groupBy] || [];
};

// Flattens nested objects in a data row using key_subkey naming so AG Grid can
// address each leaf value with a plain string field.
// e.g. "Alpha (% NAV vs XBI US Equity)": { SIMPLE: -0.002, "NET ADJ": -0.001 }
//   → "Alpha (% NAV vs XBI US Equity)_SIMPLE": -0.002
//   → "Alpha (% NAV vs XBI US Equity)_NET ADJ": -0.001
// Primitive values are passed through as-is.
const flattenDataRow = (
  stat: Record<string, unknown>
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(stat)) {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      for (const [subKey, subValue] of Object.entries(
        value as Record<string, unknown>
      )) {
        result[`${key}_${subKey}`] = subValue;
      }
    } else {
      result[key] = value;
    }
  }
  return result;
};

export const transformAlphaAnalysisResponse = (
  response: GetAlphaAnalysisStats200[]
): AlphaAnalysisRow[] => {
  if (!response || response.length === 0) return [];

  if (response.length > 1) {
    const fundDataMap = response.reduce((map, benchmarkResponse) => {
      const benchmarkId = (benchmarkResponse as { benchmark_id?: string })
        .benchmark_id;

      benchmarkResponse.data.forEach((stat) => {
        const fundName = String(stat.fund_name ?? "");
        if (!map.has(fundName)) {
          map.set(fundName, {
            fund_name: (stat.fund_name as string | null | undefined) ?? null,
            cumulative_pnl_percent_nav: stat.cumulative_pnl_percent_nav,
            uniqueIds: [fundName],
          });
        }

        if (benchmarkId) {
          Object.assign(map.get(fundName)!, {
            [`${benchmarkId}_cumulative_benchmark_pnl_percent`]:
              stat.cumulative_benchmark_pnl_percent,
            [`${benchmarkId}_cumulative_simple_alpha_pnl_percent_nav`]:
              stat.cumulative_simple_alpha_pnl_percent_nav,
            [`${benchmarkId}_cumulative_net_adjusted_alpha_pnl_percent_nav`]:
              stat.cumulative_net_adjusted_alpha_pnl_percent_nav,
          });
        }
      });

      return map;
    }, new Map<string, AlphaAnalysisRow>());

    return Array.from(fundDataMap.values());
  }

  // Single response: flatten any nested objects so column field names stay consistent
  // with the keys used in createColumnsFromMetadata (driven by metadata.display_columns).
  const singleData = response[0]?.data;
  if (!singleData) return [];

  return singleData.map((stat, index) => {
    const rawStat = stat as unknown as Record<string, unknown>;
    const flatStat = flattenDataRow(rawStat);

    return {
      ...flatStat,
      fund_name: (stat.fund_name as string) ?? null,
      uniqueIds: [
        String(
          stat.primary_analyst ??
            stat.secondary_analyst ??
            stat.fund_name ??
            stat.company_subsector ??
            stat.portfolio_team ??
            stat.market_cap ??
            `row-${index}`
        ),
      ],
    } as AlphaAnalysisRow;
  });
};
