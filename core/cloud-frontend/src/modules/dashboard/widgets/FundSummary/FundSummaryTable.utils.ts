import { Filters } from "@typings/Filters";
import { MetricResult, MetricRequest } from "@api/types";

type GetFundSummaryArgs = {
  startDate: string;
  endDate: string;
  filters: Filters;
};

export interface FundSummaryRow {
  id: string;
  name: string;
  value: unknown;
}

export const shouldIncludeGL = (filters: Filters): boolean => {
  const activeFilters = Object.keys(filters).filter(
    (key) => filters[key] && filters[key].length > 0
  );

  if (activeFilters.length === 0) {
    return true;
  }

  if (activeFilters.length === 1 && activeFilters[0] === "fund_name") {
    return true;
  }

  return false;
};

export const getFundSummaryPayload1 = ({
  startDate,
  endDate,
  filters,
}: GetFundSummaryArgs): MetricRequest[] => [
  {
    metrics: [{ name: "total_nav" }, { name: "cumulative_pnl_percent_nav" }],
    filters: filters,
    start_date: startDate,
    end_date: endDate,
  },
];

export const getFundSummaryPayload2 = ({
  startDate,
  endDate,
  filters,
}: GetFundSummaryArgs): MetricRequest[] => [
  {
    metrics: [{ name: "cumulative_pnl_percent_nav" }],
    filters: { ...filters, direction: ["Long"] },
    start_date: startDate,
    end_date: endDate,
  },
  {
    metrics: [{ name: "cumulative_pnl_percent_nav" }],
    filters: { ...filters, direction: ["Short"] },
    start_date: startDate,
    end_date: endDate,
  },
];

export const getFundSummaryRequest = ({
  startDate,
  endDate,
  filters,
}: GetFundSummaryArgs): MetricRequest[] => [
  {
    metrics: [{ name: "total_nav" }, { name: "cumulative_pnl_percent_nav" }],
    filters: filters,
    start_date: startDate,
    end_date: endDate,
  },
  {
    metrics: [{ name: "cumulative_pnl_percent_nav" }],
    filters: { ...filters, direction: ["Long"] },
    start_date: startDate,
    end_date: endDate,
  },
  {
    metrics: [{ name: "cumulative_pnl_percent_nav" }],
    filters: { ...filters, direction: ["Short"] },
    start_date: startDate,
    end_date: endDate,
  },
];

export const transformFundSummaryResponse = (
  response: MetricResult[]
): FundSummaryRow[] => {
  const rows = [
    {
      id: "NAV",
      name: "NAV",
      value: response[0]?.data?.[0]?.total_nav,
    },
    {
      id: "PnL (%)",
      name: "PnL (%)",
      value: response[0]?.data?.[0]?.cumulative_pnl_percent_nav,
    },
    {
      id: "Long PnL (%)",
      name: "Long PnL (%)",
      value: response[1]?.data?.[0]?.cumulative_pnl_percent_nav,
    },
    {
      id: "Short PnL (%)",
      name: "Short PnL (%)",
      value: response[2]?.data?.[0]?.cumulative_pnl_percent_nav,
    },
  ];

  return rows;
};
