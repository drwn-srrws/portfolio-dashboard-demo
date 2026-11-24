import { CustomCellRendererProps } from "@ag-grid-community/react";
import { CompanyResponse as Company, CompanyWorkflowStatus } from "@api/types";
import { KgStatus } from "@/api/types/kgStatus";
import { NameCellContent } from "./NameCellContent";
import { RowLevel } from "../../types/RowLevel";

export interface NameCellValue {
  id: number;
  name: string;
  in_portfolio?: boolean | null;
  workflowStatus: CompanyWorkflowStatus | null;
  kgStatus?: KgStatus | null;
}

export const NameCell = (
  params: CustomCellRendererProps<Company, NameCellValue>
) => {
  const { value, node } = params;
  if (!value) return;
  const { id, name, workflowStatus, in_portfolio, kgStatus } = value;

  if (node.level !== RowLevel.Company)
    return <div className="flex items-center gap-2 size-full">{name}</div>;

  return (
    <NameCellContent
      companyId={id}
      name={name}
      workflowStatus={workflowStatus}
      in_portfolio={in_portfolio}
      kgStatus={kgStatus}
    />
  );
};
