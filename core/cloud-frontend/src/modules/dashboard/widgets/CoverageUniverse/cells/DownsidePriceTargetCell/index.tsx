import { CustomCellRendererProps } from "@ag-grid-community/react";
import {
  CompanyResponse as Company,
  CompanyResponsePrimaryAnalystDownsidePriceTarget as DownsidePriceTarget,
} from "@api/types";
import { DownsidePriceTargetCellContent } from "./DownsidePriceTargetCellContent";
import { RowLevel } from "../../types/RowLevel";

export interface DownsidePriceTargetCellValue {
  companyId: number;
  primaryAnalystId: number | null;
  priceTarget: DownsidePriceTarget;
}

export const DownsidePriceTargetCell = ({
  value,
  node,
}: CustomCellRendererProps<Company, DownsidePriceTargetCellValue>) => {
  if (!value) return null;
  if (node.level !== RowLevel.Company) return null;

  return (
    <DownsidePriceTargetCellContent
      companyId={value.companyId}
      primaryAnalystId={value.primaryAnalystId}
      priceTarget={value.priceTarget}
    />
  );
};
