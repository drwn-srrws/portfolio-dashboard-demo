import { CustomCellRendererProps } from "@ag-grid-community/react";
import { StaleEstimate } from "../../types/StaleEstimatesData";
import { EstimateCell } from "../shared/EstimateCell";

interface UpsideEstimateCellProps
  extends CustomCellRendererProps<StaleEstimate, number> {
  onChange?: (estimateId: string, value: number) => void;
}

export const UpsideEstimateCell = (props: UpsideEstimateCellProps) => {
  return <EstimateCell {...props} type="upside" />;
};
