import { startOfYear } from "date-fns";

import { startOfMonth, startOfQuarter } from "date-fns";

import { subDays } from "date-fns";

export const toggleOptions = [
  { label: "MTD", value: "Month to Date" },
  { label: "QTD", value: "Quarter to Date" },
  { label: "YTD", value: "Year to Date" },
];

export const calculateDateRange = (option: string) => {
  const today = new Date();
  let start: Date;
  const end = today;

  switch (option) {
    case "Last 30 days":
      start = subDays(today, 30);
      break;
    case "Last 60 days":
      start = subDays(today, 60);
      break;
    case "Last 90 days":
      start = subDays(today, 90);
      break;
    case "Month to Date":
      start = startOfMonth(today);
      break;
    case "Quarter to Date":
      start = startOfQuarter(today);
      break;
    case "Year to Date":
      start = startOfYear(today);
      break;
    default:
      start = new Date("2020-10-10");
  }

  return { start, end };
};
