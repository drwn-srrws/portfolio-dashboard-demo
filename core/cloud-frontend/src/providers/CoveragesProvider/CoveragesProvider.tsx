import { useCallback, useEffect, useState } from "react";
import { CompanyCoverageResponse, LoginResponse } from "@api/types";
import { useReadCompanyCoverages } from "@api/endpoints/company/company";
import { RoleKinds } from "@typings/Role";
import { hasRole } from "@/utils/roleUtils";
import { CoveragesContext } from "./CoveragesContext";

export const CoveragesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [coveragesByCompany, setCoveragesByCompany] = useState<
    Record<number, CompanyCoverageResponse[]>
  >({});

  const { data } = useReadCompanyCoverages();

  useEffect(() => {
    if (data) {
      const newCoverages: Record<number, CompanyCoverageResponse[]> = {};

      data?.forEach((companyCoverage) => {
        if (newCoverages[companyCoverage.company_id])
          newCoverages[companyCoverage.company_id].push(companyCoverage);
        else newCoverages[companyCoverage.company_id] = [companyCoverage];
      });
      setCoveragesByCompany(newCoverages);
    }
  }, [data]);

  const getCoveragesForCompany = useCallback(
    (companyId: number) => {
      return coveragesByCompany[companyId];
    },
    [coveragesByCompany]
  );

  const getIdOfLeadAnalystForCompany = useCallback(
    (companyId: number) => {
      const companyCoverages = coveragesByCompany[companyId];
      if (!companyCoverages) return undefined;

      const leadAnalystCoverage = companyCoverages.find(
        (coverage) => coverage.coverage_type === "primary"
      );

      return leadAnalystCoverage?.user_id;
    },
    [coveragesByCompany]
  );

  const canUserCreateAPriceTargetForThisCompany = useCallback(
    (companyId: number, user: LoginResponse) => {
      if (hasRole(user.roles, [RoleKinds.PortfolioManager])) return true;

      const companyCoverages = coveragesByCompany[companyId];

      if (!companyCoverages) return false;
      else {
        const coverage = !!companyCoverages.find(
          (coverage) => coverage.user_id === user.id
        );

        return coverage;
      }
    },
    [coveragesByCompany]
  );

  return (
    <CoveragesContext.Provider
      value={{
        getCoveragesForCompany,
        canUserCreateAPriceTargetForThisCompany,
        getIdOfLeadAnalystForCompany,
      }}
    >
      {children}
    </CoveragesContext.Provider>
  );
};
