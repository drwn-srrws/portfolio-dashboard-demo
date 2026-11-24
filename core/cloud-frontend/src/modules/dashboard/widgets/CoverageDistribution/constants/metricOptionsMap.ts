import { Selectable } from "@typings/Selectable";

export const metricOptionsMap: Record<string, Selectable[]> = {
  company: [
    {
      label: "Market Cap",
      value: "market_cap",
    },
  ],
  subsector: [
    {
      label: "Market Cap",
      value: "market_cap",
    },
    {
      label: "# of Companies",
      value: "num_companies",
    },
  ],
};
