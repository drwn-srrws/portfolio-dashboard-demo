import { CustomCellRendererProps } from "@ag-grid-community/react";
import {
  CompanyResponse as Company,
  CompanyResponsePrimaryAnalystRating as Rating,
} from "@api/types";
import { RatingCellContent } from "./RatingCellContent";
import { RowLevel } from "../../types/RowLevel";

export interface RatingCellValue {
  companyId: number;
  primaryAnalystId: number | null;
  rating: Rating;
}

export const RatingCell = ({
  value,
  node,
}: CustomCellRendererProps<Company, RatingCellValue>) => {
  if (!value) return null;
  if (node.level !== RowLevel.Company) return null;

  return (
    <RatingCellContent
      companyId={value.companyId}
      rating={value.rating}
      primaryAnalystId={value.primaryAnalystId}
    />
  );
};
