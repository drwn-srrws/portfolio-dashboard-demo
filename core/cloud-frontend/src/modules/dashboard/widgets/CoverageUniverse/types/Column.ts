export const Column = {
  Name: "Name",
  NetExposure: "NetExposure",
  Ticker: "Ticker",
  Currency: "Currency",
  Coverage: "Coverage",
  PrimaryAnalyst: "PrimaryAnalyst",
  SecondaryAnalysts: "SecondaryAnalysts",
  VentureAnalyst: "VentureAnalyst",

  UpsidePriceTarget: "UpsidePriceTarget",
  DownsidePriceTarget: "DownsidePriceTarget",

  Rating: "Rating",

  Price: "Price",
  PriceMovement: "PriceMovement",
  MarketCap: "MarketCap",

  TotalRaised: "TotalRaised",
  LastRound: "LastRound",

  EnterpriseValue: "EnterpriseValue",
  Volume: "Volume",

  GrossTotalReturn: "GrossTotalReturn",
  DayHigh: "DayHigh",
  DayLow: "DayLow",
  ShortInterestRatio: "ShortInterestRatio",
  ShortInterestPctEquity: "ShortInterestPctEquity",
  SharesOutstanding: "SharesOutstanding",
  AvgVolume3m: "AvgVolume3m",
  High52w: "High52w",
  Low52w: "Low52w",

  DtdDollarReturn: "DtdDollarReturn",
  DtdPercentReturn: "DtdPercentReturn",
  MtdDollarReturn: "MtdDollarReturn",
  MtdPercentReturn: "MtdPercentReturn",
  QtdDollarReturn: "QtdDollarReturn",
  QtdPercentReturn: "QtdPercentReturn",
  YtdDollarReturn: "YtdDollarReturn",
  YtdPercentReturn: "YtdPercentReturn",
  IvolRatio: "IvolRatio",

  Modality: "Modality",
  DiseaseArea: "DiseaseArea",
  MechanismsOfActions: "MechanismsOfActions",
  DevelopmentStage: "DevelopmentStage",
  RealTimePrice: "RealTimePrice",
  TherapeuticArea: "TherapeuticArea",
} as const;

export type Column = keyof typeof Column;
