import { CustomCellRendererProps } from "@ag-grid-community/react";
import { CompanyResponse as Company } from "@api/types";
import { CompanyResponsePrimaryAnalystUpsidePriceTarget as UpsidePriceTarget } from "@api/types";
import { UpsidePriceTargetCellContent } from "./UpsidePriceTargetCellContent";
import { RowLevel } from "../../types/RowLevel";

export interface UpsidePriceTargetCellValue {
  companyId: number;
  primaryAnalystId: number | null;
  priceTarget: UpsidePriceTarget;
}

export const UpsidePriceTargetCell = ({
  value,
  node,
}: CustomCellRendererProps<Company, UpsidePriceTargetCellValue>) => {
  if (!value) return null;
  if (node.level !== RowLevel.Company) return null;

  return (
    <UpsidePriceTargetCellContent
      companyId={value.companyId}
      primaryAnalystId={value.primaryAnalystId}
      priceTarget={value.priceTarget}
    />
  );
};
