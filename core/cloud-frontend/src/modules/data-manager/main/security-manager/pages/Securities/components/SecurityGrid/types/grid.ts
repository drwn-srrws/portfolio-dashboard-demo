import type { ColDef } from "@ag-grid-community/core";
import type { InstrumentResponse } from "@/api/types";
import type { ColumnId } from "./column";

export type Instrument = InstrumentResponse;

export type InstrumentField =
  | "id"
  | "name"
  | "ticker"
  | "enfusion_id"
  | "asset_class"
  | "updated_at_utc"
  | "publish_status"
  | "progress";

export type InstrumentColDef = Omit<ColDef<Instrument>, "field" | "colId"> & {
  field?: InstrumentField;
  colId?: ColumnId;
};
