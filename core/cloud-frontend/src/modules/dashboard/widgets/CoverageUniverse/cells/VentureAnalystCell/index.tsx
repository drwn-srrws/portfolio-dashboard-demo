import { CustomCellRendererProps } from "@ag-grid-community/react";
import { UserResponse } from "@api/types";

import { usePanel } from "@/providers/PanelProvider";
import { CompanyRow } from "../../helpers/mapCompaniesToRows";
import { RowLevel } from "../../types/RowLevel";
import { VentureAnalystCellContent } from "./VentureAnalystCellContent";

export interface VentureAnalystCellValue {
  companyId: number;
  ventureAnalyst: UserResponse | null;
}

export const VentureAnalystCell = (
  params: CustomCellRendererProps<CompanyRow, VentureAnalystCellValue>
) => {
  const { value, node } = params;
  const panelContext = usePanel();
  const avatarOnly = panelContext?.params?.cellRendererParams?.avatarOnly;

  if (!value) return null;
  if (node.level !== RowLevel.Company) return null;

  const { companyId, ventureAnalyst } = value;

  return (
    <VentureAnalystCellContent
      companyId={companyId}
      ventureAnalyst={ventureAnalyst}
      avatarOnly={avatarOnly}
    />
  );
};
