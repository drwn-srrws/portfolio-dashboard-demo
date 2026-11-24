export type CreditSummaryEntry = {
  Investment: string;
  "Entry Date": Date | null;
  "Exit Date": Date | null;
  "Invested Cost": number;
  "Market Value": number;
  "% of Total Market Value": number;
  "Return of Capital": number;
  "Interest Income": number;
  "Realized Proceeeds": number;
  "Total Value": number;
  "Gross IRR": number;
  "Gross MOIC": number;
  "Net IRR": number;
  "Net MOIC": number;
  "ITD PnL": number;
  "% of Total ITD PnL": number;
};

export const data: CreditSummaryEntry[] = [
  {
    Investment: "Investment A",
    "Entry Date": "12/14/21",
    "Exit Date": "12/1/24",
    "Invested Cost": 10000000,
    "Market Value": 0,
    "% of Total Market Value": 0,
    "Return of Capital": 10000000,
    "Interest Income": 550000,
    "Realized Proceeeds": 10550000,
    "Total Value": 10550000,
    "Gross IRR": "5.50%",
    "Gross MOIC": 1.055,
    "Net IRR": "5.25%",
    "Net MOIC": 1.045,
    "ITD PnL": 550000,
    "% of Total ITD PnL": 0.127610209,
  },
  {
    Investment: "Investment B",
    "Entry Date": "1/5/23",
    "Exit Date": "--",
    "Invested Cost": 12950000,
    "Market Value": 7100000,
    "% of Total Market Value": 0.387978142,
    "Return of Capital": 7000000,
    "Interest Income": 2100000,
    "Realized Proceeeds": 9100000,
    "Total Value": 16200000,
    "Gross IRR": "14.45%",
    "Gross MOIC": 1.250965251,
    "Net IRR": "14.10%",
    "Net MOIC": 1.2239,
    "ITD PnL": 3250000,
    "% of Total ITD PnL": 0.754060325,
  },
  {
    Investment: "Investment C",
    "Entry Date": "2/2/24",
    "Exit Date": "--",
    "Invested Cost": 13100000,
    "Market Value": 11200000,
    "% of Total Market Value": 0.612021858,
    "Return of Capital": 2000000,
    "Interest Income": 410000,
    "Realized Proceeeds": 2410000,
    "Total Value": 13610000,
    "Gross IRR": "6.12%",
    "Gross MOIC": 1.038931298,
    "Net IRR": "5.99%",
    "Net MOIC": 1.0319,
    "ITD PnL": 510000,
    "% of Total ITD PnL": 0.118329466,
  },
].map((item) => ({
  ...item,

  Investment: item.Investment,
  "Entry Date":
    item["Entry Date"] === "--" ? null : new Date(item["Entry Date"]),
  "Exit Date": item["Exit Date"] === "--" ? null : new Date(item["Exit Date"]),
  "Gross IRR": Number(item["Gross IRR"].replaceAll("%", " ")) / 100,
  "Net IRR": Number(item["Net IRR"].replaceAll("%", " ")) / 100,
}));
