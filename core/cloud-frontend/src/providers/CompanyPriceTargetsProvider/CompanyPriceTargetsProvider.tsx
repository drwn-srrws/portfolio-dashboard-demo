import { JSX, useState } from "react";
import { CompanyPriceTargetsContext } from "./CompanyPriceTargetsContext";

export const CompanyPriceTargetsProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [companyId, setCompanyId] = useState<number | null>(null);
  const Provider = CompanyPriceTargetsContext.Provider;

  return <Provider value={{ companyId, setCompanyId }}>{children}</Provider>;
};
