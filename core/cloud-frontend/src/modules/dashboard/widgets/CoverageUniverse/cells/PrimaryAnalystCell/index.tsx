import { CustomCellRendererProps } from "@ag-grid-community/react";
import { UserResponse } from "@api/types";
import { PrimaryAnalystCellContent } from "./PrimaryAnalystCellContent";
import { RowLevel } from "../../types/RowLevel";
import { CompanyRow } from "../../helpers/mapCompaniesToRows";
import { usePanel } from "@/providers/PanelProvider";

export interface PrimaryAnalystCellValue {
  companyId: number;
  primaryAnalyst: UserResponse | null;
  secondaryAnalysts: UserResponse[];
}

export const PrimaryAnalystCell = (
  params: CustomCellRendererProps<CompanyRow, PrimaryAnalystCellValue>
) => {
  const { value, node } = params;
  const panelContext = usePanel();
  const avatarOnly = panelContext?.params?.cellRendererParams?.avatarOnly;

  if (!value) return null;
  if (node.level !== RowLevel.Company) return null;

  const { companyId, primaryAnalyst, secondaryAnalysts } = value;

  return (
    <PrimaryAnalystCellContent
      companyId={companyId}
      primaryAnalyst={primaryAnalyst}
      secondaryAnalysts={secondaryAnalysts}
      avatarOnly={avatarOnly}
    />
  );
};
