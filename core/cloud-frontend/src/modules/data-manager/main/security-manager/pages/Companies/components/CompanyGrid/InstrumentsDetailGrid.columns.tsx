import { ColDef, ValueFormatterParams } from "@ag-grid-community/core";
import { CompanyInstrumentResponse as Instrument } from "@/api/types";

export const createInstrumentsDetailColumns = (): ColDef<Instrument>[] => [
  {
    colId: "name",
    headerName: "Instrument Name",
    field: "name",
    minWidth: 200,
    resizable: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  },
  {
    colId: "id",
    headerName: "ID",
    field: "id",
    minWidth: 80,
    maxWidth: 100,
    resizable: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    valueFormatter: (params: ValueFormatterParams<Instrument>) => {
      return params.value ? String(params.value) : "";
    },
  },
  {
    colId: "asset_class",
    headerName: "Asset Class",
    field: "asset_class",
    minWidth: 120,
    resizable: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    valueFormatter: (params: ValueFormatterParams<Instrument>) => {
      return params.value || "";
    },
  },
  {
    colId: "instrument_type",
    headerName: "Instrument Type",
    field: "instrument_type",
    minWidth: 150,
    resizable: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    valueFormatter: (params: ValueFormatterParams<Instrument>) => {
      return params.value || "";
    },
  },
  {
    colId: "instrument_subtype",
    headerName: "Instrument Sub Type",
    field: "instrument_subtype",
    minWidth: 150,
    resizable: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    valueFormatter: (params: ValueFormatterParams<Instrument>) => {
      return params.value || "";
    },
  },
  {
    colId: "portfolio_asset_class",
    headerName: "Demo Asset Class",
    field: "portfolio_asset_class",
    minWidth: 150,
    resizable: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    valueFormatter: (params: ValueFormatterParams<Instrument>) => {
      return params.value || "";
    },
  },
  {
    colId: "enfusion_id",
    headerName: "Enfusion Id",
    field: "enfusion_id",
    minWidth: 120,
    resizable: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    valueFormatter: (params: ValueFormatterParams<Instrument>) => {
      return params.value ? String(params.value) : "";
    },
  },
];
