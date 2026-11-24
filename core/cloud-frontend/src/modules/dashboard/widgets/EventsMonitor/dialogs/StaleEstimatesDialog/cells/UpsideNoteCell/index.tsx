import { CustomCellRendererProps } from "@ag-grid-community/react";
import { StaleEstimate } from "../../types/StaleEstimatesData";
import { NoteCell } from "../shared/NoteCell";

interface UpsideNoteCellProps
  extends CustomCellRendererProps<StaleEstimate, string> {
  onChange?: (estimateId: string, value: string) => void;
}

export const UpsideNoteCell = (props: UpsideNoteCellProps) => {
  return <NoteCell {...props} type="upside" />;
};
