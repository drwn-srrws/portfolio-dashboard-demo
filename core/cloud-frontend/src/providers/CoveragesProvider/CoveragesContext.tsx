import { createContext } from "react";
import { CompanyCoverageResponse, LoginResponse } from "@api/types";

export interface ICoveragesContext {
  getCoveragesForCompany: (
    companyId: number
  ) => CompanyCoverageResponse[] | undefined;
  canUserCreateAPriceTargetForThisCompany: (
    companyId: number,
    user: LoginResponse
  ) => boolean;
  getIdOfLeadAnalystForCompany: (companyId: number) => number | undefined;
}

export const CoveragesContext = createContext<ICoveragesContext | undefined>(
  undefined
);
