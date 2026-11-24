import { useContext } from "react";
import { CompanyPriceTargetsContext } from "./CompanyPriceTargetsContext";

export const useCompanyPriceTargets = () => {
  const context = useContext(CompanyPriceTargetsContext);

  if (!context) {
    throw new Error(
      "useCompanyPriceTargets must be used within a CompanyPrice"
    );
  }

  return context;
};
