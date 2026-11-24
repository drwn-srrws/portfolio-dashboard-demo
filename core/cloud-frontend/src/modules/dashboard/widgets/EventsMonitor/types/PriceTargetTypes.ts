import { UserResponse } from "@/api/types";

export type PriceTargetType = "upside" | "downside";

export interface PriceTargetData {
  id: number;
  price_target_usd: number;
  created_by: UserResponse;
  created_at_utc: string;
}

export interface PriceTargetCellValue {
  companyId: number;
  companyName: string;
  type: PriceTargetType;
  displayValue: string | null;
  priceTargetData?: PriceTargetData;
  allPriceTargets?: PriceTargetData[];
}
