import { CustomCellRendererProps } from "@ag-grid-community/react";
import { StaleEstimate } from "../../../types/StaleEstimatesData";
import { EstimateCellContent } from "./EstimateCellContent";

export interface EstimateCellProps
  extends CustomCellRendererProps<StaleEstimate, number> {
  type: "upside" | "downside";
}

export const EstimateCell = ({ data, type }: EstimateCellProps) => {
  if (!data) return null;

  return <EstimateCellContent type={type} estimateData={data} />;
};
