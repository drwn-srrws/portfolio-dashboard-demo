import { CompanyEventEstimateResponse } from "@/api/types";

export interface EventEstimateBarProps {
  percentage: number;
  coefficient: number;
  isWin?: boolean;
  allEstimates?: CompanyEventEstimateResponse[];
}

export const MAX_UI_VALUE = 190;
