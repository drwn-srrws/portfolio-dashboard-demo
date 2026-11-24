import { CustomCellRendererProps } from "@ag-grid-community/react";
import { CompanyResponse as Company, UserResponse } from "@api/types";
import { SecondaryAnalystCellContent } from "./SecondaryAnalystCellContent";
import { RowLevel } from "../../types/RowLevel";

export interface SecondaryAnalystCellValue {
  companyId: number;
  primaryAnalyst: UserResponse | null;
  secondaryAnalysts: UserResponse[];
}

export const SecondaryAnalystCell = ({
  value,
  node,
}: CustomCellRendererProps<Company>) => {
  if (!value) return null;
  if (node.level !== RowLevel.Company) return null;

  const { companyId, primaryAnalyst, secondaryAnalysts } = value;

  return (
    <SecondaryAnalystCellContent
      companyId={companyId}
      primaryAnalyst={primaryAnalyst}
      secondaryAnalysts={secondaryAnalysts}
    />
  );
};
