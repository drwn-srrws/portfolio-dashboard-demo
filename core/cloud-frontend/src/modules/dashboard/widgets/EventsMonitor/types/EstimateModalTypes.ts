import { CompanyEventEstimateResponse, UserResponse } from "@/api/types";

export interface EstimateModalPrefilledData {
  eventId: number;
  companyId: number;
  companyName: string;
  estimates?: CompanyEventEstimateResponse[];
  primaryAnalyst?: UserResponse;
}
