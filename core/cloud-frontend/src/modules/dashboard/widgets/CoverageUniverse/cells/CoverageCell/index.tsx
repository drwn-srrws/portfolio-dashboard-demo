import { CustomCellRendererProps } from "@ag-grid-community/react";
import { CompanyResponse as Company, UserResponse } from "@api/types";
import { CoverageCellContent } from "./CoverageCellContent";
import { RowLevel } from "../../types/RowLevel";

export interface CoverageCellValue {
  companyId: number;
  researchAnalysts: UserResponse[];
}

export const CoverageCell = ({
  value,
  node,
}: CustomCellRendererProps<Company, CoverageCellValue>) => {
  if (!value) return null;
  if (node.level !== RowLevel.Company) return null;

  const { companyId, researchAnalysts } = value;

  return (
    <CoverageCellContent
      companyId={companyId}
      researchAnalysts={researchAnalysts}
    />
  );
};
