import { InstrumentSortField as IInstrumentSortField } from "@/api/types";

export const InstrumentSortField: Record<IInstrumentSortField, string> = {
  id: "id",
  updated_at_utc: "updated_at_utc",
  name: "name",
  ticker: "ticker",
  asset_class: "asset_class",
  publish_status: "publish_status",
};

export type InstrumentSortField = keyof typeof InstrumentSortField;

export const instrumentSortFields = Object.values(InstrumentSortField);
