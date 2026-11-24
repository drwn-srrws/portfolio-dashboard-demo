import { CustomCellRendererProps } from "@ag-grid-community/react";
import { StaleEstimate } from "../../types/StaleEstimatesData";
import { NoteCell } from "../shared/NoteCell";

interface DownsideNoteCellProps
  extends CustomCellRendererProps<StaleEstimate, string> {
  onChange?: (estimateId: string, value: string) => void;
}

export const DownsideNoteCell = (props: DownsideNoteCellProps) => {
  return <NoteCell {...props} type="downside" />;
};
