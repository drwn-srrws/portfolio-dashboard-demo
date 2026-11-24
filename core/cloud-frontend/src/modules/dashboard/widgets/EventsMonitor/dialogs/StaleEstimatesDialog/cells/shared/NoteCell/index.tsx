import { CustomCellRendererProps } from "@ag-grid-community/react";
import { StaleEstimate } from "../../../types/StaleEstimatesData";
import { NoteCellContent } from "./NoteCellContent";

export interface NoteCellProps
  extends CustomCellRendererProps<StaleEstimate, string> {
  type: "upside" | "downside";
}

export const NoteCell = ({ data, type }: NoteCellProps) => {
  if (!data) return null;

  return <NoteCellContent type={type} estimateData={data} />;
};
