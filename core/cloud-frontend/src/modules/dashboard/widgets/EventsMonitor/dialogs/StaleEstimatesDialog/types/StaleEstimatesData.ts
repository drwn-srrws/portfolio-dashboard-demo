import {
  EventEstimateProbability,
  CompanyEventEstimateResponse,
  UserResponse,
} from "@/api/types";

export interface StaleEstimate {
  id: string;
  eventId: number;
  companyId: number;
  companyName: string;
  eventName: string;
  eventDescription: string;
  eventDate: string;
  upsideEstimate: number;
  upsideNote: string;
  downsideEstimate: number;
  downsideNote: string;
  lastUpdated: string;
  analystName?: string;
  upsidePercentage: number;
  upsideProbability: EventEstimateProbability;
  downsidePercentage: number;
  downsideProbability: EventEstimateProbability;
  userId?: number;
  estimates: CompanyEventEstimateResponse[];
  primaryAnalyst?: UserResponse;
  reaffirm: boolean;
}

export interface StaleEstimatesData {
  estimates: StaleEstimate[];
}
