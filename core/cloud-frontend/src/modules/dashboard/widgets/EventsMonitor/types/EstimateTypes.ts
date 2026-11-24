import { CompanyEventEstimateResponse } from "@/api/types";

export type EstimateData = CompanyEventEstimateResponse;

export type EstimateType = "implied_upside" | "implied_downside";

export interface EstimateCellValue {
  type: EstimateType;
  displayValue: string | null;
  eventId: number;
}
