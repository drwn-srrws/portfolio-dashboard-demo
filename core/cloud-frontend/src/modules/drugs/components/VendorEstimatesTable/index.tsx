import { useCallback, useMemo } from "react";

import type {
  CellMouseOverEvent,
  ColDef,
  RowClassParams,
  SelectionChangedEvent,
  ValueFormatterParams,
} from "@ag-grid-community/core";

import { useGetDrugVendorEstimates } from "@api/endpoints/drugs/drugs";
import { MetricDisplayType } from "@api/types";
import { DataGrid } from "@components/Datagrid/Datagrid";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ErrorOverlay } from "@components/Overlay/ErrorOverlay";
import Card from "@/modules/dashboard/widgets/Card/Card";
import { formatMetric } from "@utils/metrics";

interface VendorEstimateRow {
  id: string;
  source_kpi: string;
  qtr_estimate_usd_m: number | null;
  qtr_surprise_pct: number | null;
  y4_estimate_usd_m: number | null;
  y4_surprise_pct: number | null;
  isConsensus: boolean;
}

const estimateValueFormatter = (
  params: ValueFormatterParams<VendorEstimateRow>
) => formatMetric(params.value, "dollars_regular", { digits: 1 });

const surpriseValueFormatter = (
  params: ValueFormatterParams<VendorEstimateRow>
) => formatMetric(params.value, MetricDisplayType.percent, { digits: 1 });

const surpriseCellStyle = (params: {
  data?: VendorEstimateRow;
  value: unknown;
}) => {
  const value = params.value as number | null;
  if (value === null || value === undefined) return undefined;
  if (value > 0) return { color: "#34d399" };
  if (value < 0) return { color: "#f87171" };
  return undefined;
};

const columnDefs: ColDef<VendorEstimateRow>[] = [
  {
    colId: "source_kpi",
    field: "source_kpi",
    headerName: "Source",
    flex: 1.6,
    minWidth: 220,
  },
  {
    colId: "qtr_estimate_usd_m",
    field: "qtr_estimate_usd_m",
    headerName: "Qtr Estimate (M$)",
    type: "numericColumn",
    valueFormatter: estimateValueFormatter,
  },
  {
    colId: "qtr_surprise_pct",
    field: "qtr_surprise_pct",
    headerName: "Surprise (%)",
    type: "numericColumn",
    valueFormatter: surpriseValueFormatter,
    cellStyle: surpriseCellStyle,
  },
  {
    colId: "y4_estimate_usd_m",
    field: "y4_estimate_usd_m",
    headerName: "4Yr Estimate (M$)",
    type: "numericColumn",
    valueFormatter: estimateValueFormatter,
  },
  {
    colId: "y4_surprise_pct",
    field: "y4_surprise_pct",
    headerName: "4Yr Surprise (%)",
    type: "numericColumn",
    valueFormatter: surpriseValueFormatter,
    cellStyle: surpriseCellStyle,
  },
];

const defaultColDef = { suppressHeaderMenuButton: true };

const getRowId = (row: VendorEstimateRow) => row.id;

const getRowStyle = (params: RowClassParams<VendorEstimateRow>) =>
  params.data?.isConsensus ? { fontWeight: 600 } : undefined;

export interface VendorEstimatesTableProps {
  drugName: string;
  selectedTemplate: string;
  onHoverSource?: (source: string | null) => void;
  onSelectSource?: (source: string | null) => void;
}

export const VendorEstimatesTable = ({
  drugName,
  selectedTemplate,
  onHoverSource,
  onSelectSource,
}: VendorEstimatesTableProps) => {
  const { data, isLoading } = useGetDrugVendorEstimates(drugName, {
    template_names: [selectedTemplate],
  });

  const handleCellMouseOver = useCallback(
    (event: CellMouseOverEvent<VendorEstimateRow>) =>
      onHoverSource?.(event.data?.source_kpi ?? null),
    [onHoverSource]
  );

  const handleSelectionChanged = useCallback(
    (event: SelectionChangedEvent<VendorEstimateRow>) =>
      onSelectSource?.(event.api.getSelectedRows()[0]?.source_kpi ?? null),
    [onSelectSource]
  );

  const rows = useMemo<VendorEstimateRow[]>(() => {
    const vendorRows: VendorEstimateRow[] = (data?.estimates ?? []).map(
      (row) => ({
        id: row.source_kpi,
        source_kpi: row.source_kpi,
        qtr_estimate_usd_m: row.qtr_estimate_usd_m,
        qtr_surprise_pct: row.qtr_surprise_pct,
        y4_estimate_usd_m: row.y4_estimate_usd_m,
        y4_surprise_pct: row.y4_surprise_pct,
        isConsensus: false,
      })
    );

    if (data?.consensus) {
      vendorRows.push({
        id: "__mean_consensus__",
        source_kpi: "Mean Consensus",
        qtr_estimate_usd_m: data.consensus.qtr_estimate_usd_m,
        qtr_surprise_pct: null,
        y4_estimate_usd_m: data.consensus.y4_estimate_usd_m,
        y4_surprise_pct: null,
        isConsensus: true,
      });
    }

    return vendorRows;
  }, [data]);

  return (
    <Card title="Vendor Estimates" className="flex-none">
      <ErrorBoundary
        fallback={(errorMessage) => <ErrorOverlay description={errorMessage} />}
      >
        <div onMouseLeave={() => onHoverSource?.(null)}>
          <DataGrid<VendorEstimateRow>
            layout={{ mode: "autoHeight" }}
            rowData={rows}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            getRowId={getRowId}
            getRowStyle={getRowStyle}
            rowSelection="single"
            onCellMouseOver={handleCellMouseOver}
            onSelectionChanged={handleSelectionChanged}
            loading={isLoading && !data}
            testId="vendor-estimates-table"
          />
        </div>
      </ErrorBoundary>
    </Card>
  );
};
