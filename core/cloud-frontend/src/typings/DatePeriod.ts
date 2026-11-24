export const DatePeriod = {
  DTD: "DTD",
  T1D: "T1D",
  T5D: "T5D",
  MTD: "MTD",
  QTD: "QTD",
  YTD: "YTD",
  ITD: "ITD",
  WTD: "WTD",
  CUSTOM: "CUSTOM",
} as const;

export type DatePeriod = (typeof DatePeriod)[keyof typeof DatePeriod];
