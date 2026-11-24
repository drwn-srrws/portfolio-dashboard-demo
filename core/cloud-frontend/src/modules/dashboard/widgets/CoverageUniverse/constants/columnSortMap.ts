import { CompanySort } from "@api/types";
import { Column } from "../types/Column";

export const columnSortMap: Record<Column, CompanySort | null> = {
  [Column.Name]: "name",
  [Column.NetExposure]: null,
  [Column.Ticker]: null,
  [Column.Currency]: null,
  [Column.Coverage]: "research_analysts",
  [Column.PrimaryAnalyst]: "primary_analyst",
  [Column.SecondaryAnalysts]: "secondary_analysts",
  [Column.VentureAnalyst]: "venture_analyst",
  [Column.Rating]: "primary_analyst_rating",
  [Column.UpsidePriceTarget]: "primary_analyst_upside_price_target",
  [Column.DownsidePriceTarget]: "primary_analyst_downside_price_target",

  [Column.Price]: "last_price_bbg",
  [Column.RealTimePrice]: null,
  [Column.PriceMovement]: "market_price_history_mtd_bbg",
  [Column.MarketCap]: "market_cap_bbg",

  // Pitchbook display columns are not server-sortable.
  [Column.TotalRaised]: null,
  [Column.LastRound]: null,

  [Column.Modality]: null,
  [Column.DiseaseArea]: null,
  [Column.MechanismsOfActions]: null,
  [Column.DevelopmentStage]: null,
  [Column.TherapeuticArea]: null,

  [Column.EnterpriseValue]: "enterprise_value_bbg",
  [Column.Volume]: "volume_bbg",
  [Column.GrossTotalReturn]: "gross_total_return_bbg",

  [Column.DayHigh]: "day_high_bbg",
  [Column.DayLow]: "day_low_bbg",
  [Column.ShortInterestRatio]: "short_interest_ratio_bbg",
  [Column.ShortInterestPctEquity]: "short_interest_pct_equity_bbg",
  [Column.SharesOutstanding]: "shares_outstanding_bbg",
  [Column.AvgVolume3m]: "avg_volume_3m_bbg",
  [Column.High52w]: "high_52w_bbg",
  [Column.Low52w]: "low_52w_bbg",

  [Column.DtdDollarReturn]: "dtd_dollar_return_bbg",
  [Column.DtdPercentReturn]: "dtd_percent_return_bbg",
  [Column.MtdDollarReturn]: "mtd_dollar_return_bbg",
  [Column.MtdPercentReturn]: "mtd_percent_return_bbg",
  [Column.QtdDollarReturn]: "qtd_dollar_return_bbg",
  [Column.QtdPercentReturn]: "qtd_percent_return_bbg",
  [Column.YtdDollarReturn]: "ytd_dollar_return_bbg",
  [Column.YtdPercentReturn]: "ytd_percent_return_bbg",

  [Column.IvolRatio]: "ivol_ratio",
};

export const getSortBy = (column: string) => {
  const sort = columnSortMap[column as Column];

  if (sort) return sort;

  return null;
};
