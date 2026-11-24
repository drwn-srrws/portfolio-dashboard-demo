import { Column } from "../types/Column";

type EventsMonitorSort =
  | "name"
  | "primary_analyst"
  | "secondary_analysts"
  | "research_analysts"
  | "primary_analyst_upside_price_target"
  | "primary_analyst_downside_price_target"
  | "next_event"
  | "next_biggest_event"
  | "date"
  | null;

export const columnSortMap: Record<Column, EventsMonitorSort> = {
  [Column.Company]: "name",
  [Column.Ticker]: null,
  [Column.Size]: null,
  [Column.YtdPnl]: null,
  [Column.PrimaryAnalyst]: "primary_analyst",
  [Column.SecondaryAnalysts]: "secondary_analysts",
  [Column.Coverage]: "research_analysts",
  [Column.UpsidePt]: "primary_analyst_upside_price_target",
  [Column.DownsidePt]: "primary_analyst_downside_price_target",
  [Column.NextEvent]: "next_event",
  [Column.NextBiggestEvent]: "next_biggest_event",
  [Column.DaysUntilEvent]: null,
  [Column.Workstream]: null,
  [Column.RiskReward]: null,
  [Column.Estimate]: null,

  [Column.Event]: "name",
  [Column.EventWorkstream]: null,
  [Column.Description]: null,
  [Column.Date]: "date",
  [Column.DaysUntil]: null,
  [Column.EstimateCount]: null,
  [Column.Stoplights]: null,
  [Column.UpsidePercentage]: null,
  [Column.ImpliedUpside]: null,
  [Column.UpsidePos]: null,
  [Column.UpsideNote]: null,
  [Column.DownsidePercentage]: null,
  [Column.ImpliedDownside]: null,
  [Column.DownsidePos]: null,
  [Column.DownsideNote]: null,
  [Column.LastUpdate]: null,
  [Column.UpPnlNav]: null,
  [Column.DownPnlNav]: null,
};

export const getSortBy = (column: string) => {
  const sort = columnSortMap[column as Column];
  return sort || null;
};
