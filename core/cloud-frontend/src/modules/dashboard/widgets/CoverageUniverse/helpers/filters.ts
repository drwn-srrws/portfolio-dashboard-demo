import {
  CompanyFilterField,
  CompanyComparisonFilterValue,
  ComparisonOperator,
  CompanyLogicalFilterFiltersItem,
  LogicalOperator,
} from "@/api/types";
import { Filters } from "@/typings/Filters";

const createPositionSizeFilter = (value: string | number | boolean) => {
  const positionSizeMap = {
    "<=100 bps": { op: "lte" as ComparisonOperator, value: 0.01 },
    ">100 bps": { op: "gt" as ComparisonOperator, value: 0.01 },
  };

  const config = positionSizeMap[value as keyof typeof positionSizeMap];
  return config
    ? {
        field: "position_size" as CompanyFilterField,
        op: config.op,
        value: config.value as CompanyComparisonFilterValue,
      }
    : null;
};

// Build a closed range [from, to) as a nested AND of two comparisons. The
// backend has no `between` operator, so range buckets (e.g. market-cap M,
// total-raised mid-bands) are expressed as AND(gt|gte, lt|lte).
const createRangeFilter = (
  field: CompanyFilterField,
  from: { op: ComparisonOperator; value: number },
  to: { op: ComparisonOperator; value: number }
): CompanyLogicalFilterFiltersItem => ({
  op: "and" as LogicalOperator,
  filters: [
    { field, op: from.op, value: from.value as CompanyComparisonFilterValue },
    { field, op: to.op, value: to.value as CompanyComparisonFilterValue },
  ],
});

// Market-cap size buckets on market_cap_bbg (USD). Thresholds match the
// Alpha Analysis convention: S <= 1e9, M (1e9, 5e9], L > 5e9.
const createMarketCapFilter = (
  value: string | number | boolean
): CompanyLogicalFilterFiltersItem | null => {
  const field = "market_cap_bbg" as CompanyFilterField;
  switch (value) {
    case "S (≤1B)":
      return {
        field,
        op: "lte" as ComparisonOperator,
        value: 1_000_000_000 as CompanyComparisonFilterValue,
      };
    case "M (1B-5B)":
      return createRangeFilter(
        field,
        { op: "gt" as ComparisonOperator, value: 1_000_000_000 },
        { op: "lte" as ComparisonOperator, value: 5_000_000_000 }
      );
    case "L (>5B)":
      return {
        field,
        op: "gt" as ComparisonOperator,
        value: 5_000_000_000 as CompanyComparisonFilterValue,
      };
    default:
      return null;
  }
};

// Total-raised bands on pitchbook_profile.total_raised (USD, already scaled
// from $M by the API). Mutually exclusive.
const createTotalRaisedFilter = (
  value: string | number | boolean
): CompanyLogicalFilterFiltersItem | null => {
  const field = "pitchbook_profile.total_raised" as CompanyFilterField;
  switch (value) {
    case "$50M-$100M":
      return createRangeFilter(
        field,
        { op: "gte" as ComparisonOperator, value: 50_000_000 },
        { op: "lt" as ComparisonOperator, value: 100_000_000 }
      );
    case "$100M-$250M":
      return createRangeFilter(
        field,
        { op: "gte" as ComparisonOperator, value: 100_000_000 },
        { op: "lt" as ComparisonOperator, value: 250_000_000 }
      );
    case ">$250M":
      return {
        field,
        op: "gte" as ComparisonOperator,
        value: 250_000_000 as CompanyComparisonFilterValue,
      };
    default:
      return null;
  }
};

// Fields whose selected dropdown labels are bucket presets that map to range
// predicates rather than a literal `eq` on the value.
const BUCKET_FILTER_BUILDERS: Record<
  string,
  (value: string | number | boolean) => CompanyLogicalFilterFiltersItem | null
> = {
  position_size: createPositionSizeFilter,
  market_cap_bbg: createMarketCapFilter,
  "pitchbook_profile.total_raised": createTotalRaisedFilter,
};

export const mapFiltersToCompanyFilters = (
  filters?: Filters
): CompanyLogicalFilterFiltersItem[] => {
  if (!filters) return [];

  return Object.entries(filters)
    .filter(([, value]) => value?.length > 0)
    .map(([field, values]) => {
      const bucketBuilder = BUCKET_FILTER_BUILDERS[field];
      const filterItems = bucketBuilder
        ? values
            .map(bucketBuilder)
            .filter((item): item is NonNullable<typeof item> => item !== null)
        : values.map((v) => ({
            field: field as CompanyFilterField,
            op: "eq" as ComparisonOperator,
            value: v as CompanyComparisonFilterValue,
          }));

      return {
        op: "or" as const,
        filters: filterItems,
      };
    })
    .filter((filter) => filter.filters.length > 0);
};
