export const Column = {
  // Company columns
  Company: "Company",
  Ticker: "Ticker",
  Size: "Size",
  YtdPnl: "YtdPnl",
  PrimaryAnalyst: "PrimaryAnalyst",
  SecondaryAnalysts: "SecondaryAnalysts",
  Coverage: "Coverage",
  UpsidePt: "UpsidePt",
  DownsidePt: "DownsidePt",
  NextEvent: "NextEvent",
  NextBiggestEvent: "NextBiggestEvent",
  DaysUntilEvent: "DaysUntilEvent",
  Workstream: "Workstream",
  RiskReward: "RiskReward",
  // CreateEvent column removed; create moved to nested grid header

  // Event columns
  Event: "Event",
  EventWorkstream: "EventWorkstream",
  Description: "Description",
  Date: "Date",
  DaysUntil: "DaysUntil",
  EstimateCount: "EstimateCount",
  Stoplights: "Stoplights",
  Estimate: "Estimate",
  UpsidePercentage: "UpsidePercentage",
  ImpliedUpside: "ImpliedUpside",
  UpsidePos: "UpsidePos",
  UpsideNote: "UpsideNote",
  DownsidePercentage: "DownsidePercentage",
  ImpliedDownside: "ImpliedDownside",
  DownsidePos: "DownsidePos",
  DownsideNote: "DownsideNote",
  LastUpdate: "LastUpdate",
  UpPnlNav: "UpPnlNav",
  DownPnlNav: "DownPnlNav",
} as const;

export type Column = keyof typeof Column;
