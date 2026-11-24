import { ICellRendererParams } from "@ag-grid-community/core";

import {
  AssetClass,
  InstrumentResponse,
  InstrumentPublishStatus,
} from "@/api/types";
import { SecurityActions } from "../SecurityActions";
import { Checkbox } from "@/components/ui/checkbox";
import { capitalize } from "@/utils/strings";
import { format } from "date-fns";
import { Column } from "./types/column";
import type { InstrumentColDef } from "./types/grid";

export const defaultColDef: InstrumentColDef = {
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
  maxWidth: 400,
};

export const initColDef: InstrumentColDef = {
  comparator: () => 0,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

const assetClassMap: Record<AssetClass, string> = {
  equity: "Equity",
  fx: "FX",
  other: "Other",
  rates: "Rates",
  credit: "Credit",
  index: "Index",
};

const statusMap: Record<InstrumentPublishStatus, string> = {
  not_published: "Not Published",
  internally_published: "Internally Published",
  externally_published: "Externally Published",
};

export const createColDefs = (
  disableStatus?: boolean,
  disableProgress?: boolean,
  disablePublish?: boolean
): InstrumentColDef[] => [
  {
    ...defaultColDef,
    field: "id",
    colId: Column.Id,
    headerName: "ID",
    comparator: () => 0,
    maxWidth: 55,
  },
  {
    ...defaultColDef,
    field: "name",
    colId: Column.Name,
    headerName: "NAME",
    comparator: () => 0,
    minWidth: 300,
  },
  {
    ...defaultColDef,
    colId: Column.SecCode,
    headerName: "SECURITY CODE",
    valueGetter: ({ data }) => {
      if (!data?.security_code) return null;
      return (
        data.security_code.override?.value ?? data.security_code.value ?? null
      );
    },
    comparator: () => 0,
    maxWidth: 120,
  },
  {
    ...defaultColDef,
    field: "ticker",
    colId: Column.Ticker,
    headerName: "TICKER",
    comparator: () => 0,
    maxWidth: 95,
  },
  {
    ...defaultColDef,
    field: "enfusion_id",
    colId: Column.EnfusionId,
    headerName: "ENFUSION ID",
    comparator: () => 0,
    maxWidth: 140,
  },
  {
    ...defaultColDef,
    field: "asset_class",
    colId: Column.AssetClass,
    headerName: "ASSET CLASS",
    valueFormatter: ({ value }) => assetClassMap[value as AssetClass],
    comparator: () => 0,
    maxWidth: 100,
  },
  {
    ...defaultColDef,
    field: "updated_at_utc",
    colId: Column.UpdatedAt,
    headerName: "LAST UPDATED",
    valueFormatter: ({ value }) => format(value, "MM/dd/yyyy HH:mm"),
    comparator: () => 0,
    maxWidth: 120,
  },
  {
    ...defaultColDef,
    field: "publish_status",
    colId: Column.Status,
    headerName: "STATUS",
    valueFormatter: ({ value }) => statusMap[value as InstrumentPublishStatus],
    hide: disableStatus,
    comparator: () => 0,
    maxWidth: 100,
  },
  {
    ...defaultColDef,
    field: "progress",
    colId: Column.Progress,
    headerName: "PROGRESS",
    cellRenderer: ({ data }: ICellRendererParams<InstrumentResponse>) => {
      return (
        <div className="flex items-center gap-6">
          {data?.progress?.map(([name, checked]) => (
            <div className="flex items-center gap-2">
              <span>{capitalize(name)}</span>
              <Checkbox checked={checked} color="green" />
            </div>
          ))}
        </div>
      );
    },
    hide: disableProgress,
    comparator: () => 0,
    maxWidth: 170,
  },
  {
    ...defaultColDef,
    cellRenderer: ({ data }: ICellRendererParams<InstrumentResponse>) => {
      if (!data) return null;
      return <SecurityActions data={data} disablePublish={disablePublish} />;
    },
    colId: Column.Actions,
    sortable: false,
    pinned: "right",
  },
];
