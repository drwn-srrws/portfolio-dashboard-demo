import { CustomCellRendererProps } from "@ag-grid-community/react";
import { StaleEstimate } from "../../types/StaleEstimatesData";
import { EstimateCell } from "../shared/EstimateCell";

interface DownsideEstimateCellProps
  extends CustomCellRendererProps<StaleEstimate, number> {
  onChange?: (estimateId: string, value: number) => void;
}

export const DownsideEstimateCell = (props: DownsideEstimateCellProps) => {
  return <EstimateCell {...props} type="downside" />;
};
