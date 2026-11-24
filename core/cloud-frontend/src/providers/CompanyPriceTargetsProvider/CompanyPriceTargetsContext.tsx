import { createContext } from "react";

export interface ICompanyPriceTargetsContext {
  companyId: number | null;
  setCompanyId: (event: number | null) => void;
}

export const CompanyPriceTargetsContext =
  createContext<ICompanyPriceTargetsContext>({} as ICompanyPriceTargetsContext);
