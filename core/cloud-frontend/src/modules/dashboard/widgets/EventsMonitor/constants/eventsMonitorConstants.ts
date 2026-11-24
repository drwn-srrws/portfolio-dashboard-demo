import {
  CompanyFilterField,
  ComparisonOperator,
  LogicalOperator,
} from "@api/types";
import { Selectable } from "@typings/Selectable";
import { Column } from "../types/Column";

export const toggleFilters = {
  inPortfolio: {
    op: LogicalOperator.or,
    filters: [
      {
        field: CompanyFilterField.in_portfolio,
        op: ComparisonOperator.eq,
        value: true,
      },
    ],
  },
  flagged: {
    op: LogicalOperator.or,
    filters: [
      {
        field: CompanyFilterField.workflow_status,
        op: ComparisonOperator.eq,
        value: "Flagged",
      },
      {
        field: CompanyFilterField.workflow_status,
        op: ComparisonOperator.eq,
        value: "Bottom of Funnel",
      },
    ],
  },
};

export const columnOptions: Selectable[] = [
  { value: Column.Size, label: "Size" },
  { value: Column.YtdPnl, label: "YTD PnL" },
  { value: Column.PrimaryAnalyst, label: "Lead Analyst" },
  { value: Column.SecondaryAnalysts, label: "Secondary Analysts" },
  { value: Column.Coverage, label: "Coverage" },
  { value: Column.UpsidePt, label: "Upside PT" },
  { value: Column.DownsidePt, label: "Downside PT" },
  { value: Column.NextEvent, label: "Next Event" },
  { value: Column.NextBiggestEvent, label: "Next Biggest Event" },
  { value: Column.DaysUntilEvent, label: "Days until event" },
  { value: Column.Workstream, label: "Workflow Status" },
  { value: Column.RiskReward, label: "Risk/Reward" },
];

export const toggleOptions = [
  { value: "inPortfolio", label: "In Portfolio" },
  { value: "flagged", label: "Flagged/Bottom of Funnel" },
];

export const defaultSelectedColumns = [
  Column.Size,
  Column.YtdPnl,
  Column.PrimaryAnalyst,
  Column.SecondaryAnalysts,
  Column.Coverage,
  Column.UpsidePt,
  Column.DownsidePt,
  Column.NextEvent,
  Column.NextBiggestEvent,
  Column.DaysUntilEvent,
  Column.Workstream,
];
