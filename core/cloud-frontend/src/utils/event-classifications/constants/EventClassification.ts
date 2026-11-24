export const EventClassification = {
  financing: "Financing",
  major: "Major",
  minor: "Minor",
  cashFlowRunOut: "Cash Flow Run Out",
  yearsBiggest: "Year's Biggest",
  other: "Other",
};

export type EventClassification = keyof typeof EventClassification;
