import {
  addQuarters,
  endOfQuarter,
  getQuarter,
  getYear,
  startOfDay,
  startOfQuarter,
} from "date-fns";

import { hyphenatedDate } from "@/utils/dates";
import { ITooltipParams } from "@ag-grid-community/core";

export const quarters = ["Q1", "Q2", "Q3", "Q4"];

const NAV_IMPACT_THRESHOLD = 0.005;

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const getNextYear = () => {
  return getCurrentYear() + 1;
};

const getCurrentQuarter = () => {
  return quarters[getQuarter(new Date()) - 1];
};

const generateYears = ({ startYear }: { startYear: number }) => {
  const endYear = getNextYear();

  return Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index
  );
};

export const years = generateYears({ startYear: 2021 });

export const currentYear = getCurrentYear().toString();
export const currentQuarter = getCurrentQuarter();

export const getDateRangeByQuarter = (quarter: string, year: string) => {
  const quarterIndex = quarters.indexOf(quarter);
  if (quarterIndex === -1) {
    throw new Error("Invalid quarter");
  }

  const startDate = new Date(parseInt(year), quarterIndex * 3, 1);
  const start = hyphenatedDate(startOfQuarter(startDate));
  const end = hyphenatedDate(startOfDay(endOfQuarter(startDate)));

  return { start, end };
};

export const isImpactInRange = (impact: number) =>
  Math.abs(impact) < NAV_IMPACT_THRESHOLD;

export type Period = {
  label: string;
  value: string;

  year: string;
  quarter: string;
};

const generateAvailablePeriods = (): Period[] => {
  const startYear = 2024;
  const startQuarter = 1;

  const currentDate = new Date();

  const endDate = addQuarters(currentDate, 3);

  const endYear = getYear(endDate);
  const endQuarter = getQuarter(endDate);

  const periods: Period[] = generatePeriods(
    startYear,
    startQuarter,
    endYear,
    endQuarter
  );

  return periods;
};

function generatePeriods(
  startYear: number,
  startQuarter: number,
  endYear: number,
  endQuarter: number
): Period[] {
  const periods: Period[] = [];
  let currentYear = startYear;
  let currentQuarter = startQuarter;

  while (
    currentYear < endYear ||
    (currentYear === endYear && currentQuarter <= endQuarter)
  ) {
    const label = `Q${currentQuarter} ${currentYear}`;
    periods.push({
      label,
      value: label,
      year: currentYear.toString(),
      quarter: `Q${currentQuarter}`,
    });

    currentQuarter += 1;
    if (currentQuarter > 4) {
      currentQuarter = 1;
      currentYear += 1;
    }
  }

  return periods;
}

export const availablePeriods = generateAvailablePeriods();

export const getCurrentPeriod = () => {
  return availablePeriods.find(
    (period) => period.quarter === currentQuarter && period.year === currentYear
  );
};

export const getEventNameTooltip = (params: ITooltipParams): string => {
  return typeof params.value === "string" ? params.value : "";
};
