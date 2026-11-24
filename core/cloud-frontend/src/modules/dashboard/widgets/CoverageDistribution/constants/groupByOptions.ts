import { Selectable } from "@typings/Selectable";

export const metricOptions: Selectable[] = [
  { label: "Company", value: "company" },
  { label: "Sector", value: "sector" },
  { label: "Country", value: "country" },
  { label: "Region", value: "region" },
];

export const groupSizeOptions: Selectable[] = [
  { label: "Total Market Cap", value: "market_cap" },
  { label: "Number of Companies", value: "number_of_companies" },
];

export const companySizeOptions: Selectable[] = [
  { label: "Total Market Cap", value: "market_cap" },
];
