import { PaginatedCompanyResponse } from "@/api/types";

interface GroupStatItem {
  "subsector.name"?: string;
  region?: string;
  country?: string;
  number_of_companies: number;
  market_cap: number;
}

export interface GroupStats {
  sector: GroupStatItem[];
  region: GroupStatItem[];
  country: GroupStatItem[];
}

export interface PaginatedCompanyResponseWithGroupStats
  extends Omit<PaginatedCompanyResponse, "group_stats"> {
  group_stats?: GroupStats;
}

export type BoxType = "company" | "sector" | "country" | "region";
export type SizeMetric = "market_cap" | "number_of_companies";
