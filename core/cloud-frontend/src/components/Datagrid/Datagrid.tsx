import { Skeleton } from "@/components/ui/skeleton";
import { useConfig } from "@/providers/ConfigProvider";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { CsvExportModule } from "@ag-grid-community/csv-export";
import {
  ColDef,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  Module,
  ModuleRegistry,
  SortChangedEvent,
} from "@ag-grid-community/core";
import { AgGridReact, AgGridReactProps } from "@ag-grid-community/react";

import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import "./portfolio-ag-grid.css";

import { Sort } from "@/typings/Sort";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { LicenseManager } from "@ag-grid-enterprise/core";
import { MasterDetailModule } from "@ag-grid-enterprise/master-detail";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { SparklinesModule } from "@ag-grid-enterprise/sparklines";
import { StatusBarModule } from "@ag-grid-enterprise/status-bar";
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { DataGridOverlay } from "./components/DataGridOverlay";
import { NoDataOverlay } from "@/components/Overlay/NoDataOverlay";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/utils/utils";
import { getIndentClass } from "./helpers/getIndentClass";
import { excelStyles } from "./constants/excelStyles";
import { useIsMobile } from "@/hooks/useMobile";

const modules = [
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MenuModule,
  MasterDetailModule,
  StatusBarModule,
  SparklinesModule,
  CsvExportModule,
] as Module[];

ModuleRegistry.registerModules(modules);

const DEFAULT_THRESHOLD = 10;

export type DataGridLayout =
  | { mode: "autoHeight" }
  | { mode: "normal" }
  | { mode: "print" }
  | { mode: "responsive"; threshold?: number };

export interface DataGridProps<TRow = unknown>
  extends Omit<AgGridReactProps<TRow>, "getRowId" | "domLayout"> {
  layout?: DataGridLayout;
  rowData: TRow[];
  columnDefs: ColDef[];
  loading?: boolean;
  gridRef?: React.RefObject<GridApi | null>;
  pending?: boolean;
  sort?: Sort<string> | null;
  testId?: string;
  getRowId: (row: TRow) => string;
  onSortChange?: (sort: Sort<string> | null) => void;
}

export const DataGrid = <TRow = unknown,>({
  layout,
  rowData,
  columnDefs,
  loading,
  pending,
  sort,
  testId,
  tooltipShowMode,
  defaultColDef: propDefaultColDef,
  getRowId,
  onSortChange,
  onSortChanged,
  detailCellRendererParams: propDetailCellRendererParams,
  initialState: propInitialState,
  ...props
}: DataGridProps<TRow>) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const { agGridLicenseKey } = useConfig();

  const gridRef = useRef<GridApi | null>(null);
  const [isGridReady, setIsGridReady] = useState(false);

  const [visibleRows, setVisibleRows] = useState<string[] | null>(null);

  LicenseManager.setLicenseKey(agGridLicenseKey);

  const threshold =
    layout?.mode === "responsive"
      ? (layout.threshold ?? DEFAULT_THRESHOLD)
      : null;

  const initialState = useMemo(
    () => ({
      ...propInitialState,
    }),
    [propInitialState]
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 150,
      resizable: false,
      headerClass: "dockview-table-header",
      ...propDefaultColDef,
    }),
    [propDefaultColDef]
  );

  const autoGroupColumnDef = useMemo<ColDef>(
    () => ({
      ...props.autoGroupColumnDef,
      cellClass: getIndentClass,
    }),
    [props.autoGroupColumnDef]
  );

  const domLayout = useMemo(() => {
    if (!layout) return undefined;

    if (layout.mode === "responsive") {
      if (!visibleRows || !threshold) return "normal";
      return isMobile && visibleRows.length <= threshold
        ? "autoHeight"
        : "normal";
    }

    return layout.mode;
  }, [isMobile, layout, threshold, visibleRows]);

  const isAutoHeightLayout = domLayout === "autoHeight";

  const handleModelUpdated = useCallback(() => {
    const gridApi = gridRef.current;

    if (!gridApi || !threshold) return;

    const visibleRows: string[] = [];

    gridApi.forEachNode((node) => {
      if (node.displayed) {
        visibleRows.push(node.id as string);
      }
    });

    setVisibleRows(visibleRows);
  }, [threshold]);

  const handleGridReady = useCallback(
    (params: GridReadyEvent) => {
      const visibleRows: string[] = [];

      gridRef.current = params.api;

      if (props.gridRef) {
        props.gridRef.current = params.api;
      }

      params.api.forEachNode((node) => {
        if (node.displayed) {
          visibleRows.push(node.id as string);
        }
      });

      setVisibleRows(visibleRows);
    },
    [props.gridRef]
  );

  const getAgGridRowId = useCallback(
    (params: GetRowIdParams) => getRowId(params.data),
    [getRowId]
  );

  const handleSortChange = useCallback(
    (event: SortChangedEvent) => {
      const columns = event.columns;
      const column = columns?.find((column) => column.getSort());

      onSortChanged?.(event);

      const sort = column?.getSort();

      if (!column || !sort) return onSortChange?.(null);

      onSortChange?.({ key: column.getColId(), order: sort });
    },
    [onSortChange, onSortChanged]
  );

  const onFirstDataRendered = useCallback(() => {
    setTimeout(() => {
      setIsGridReady(true);
    }, 100);
  }, []);

  useImperativeHandle(props.gridRef, () => gridRef.current || ({} as GridApi));

  useEffect(() => {
    if (!gridRef.current) return;

    const current = gridRef.current;

    const currentSort = current
      .getColumnState()
      ?.find((state) => state.sort)?.colId;

    const newSort = sort?.key;

    if (currentSort === newSort) return;

    const states = gridRef.current.getColumnState();

    gridRef.current.applyColumnState({
      state: states?.map((state) => ({
        ...state,
        sort: sort?.key === state.colId ? sort.order : null,
      })),
    });
  }, [sort, columnDefs]);

  const detailCellRendererParams = useMemo(
    () => ({
      ...propDetailCellRendererParams,
      detailGridOptions: {
        popupParent: document.body,
        tooltipMouseTrack: true,
        tooltipShowMode,
        ...propDetailCellRendererParams?.detailGridOptions,
      },
    }),
    [propDetailCellRendererParams, tooltipShowMode]
  );

  return (
    <div
      className={cn(
        "flex flex-col",
        !isAutoHeightLayout && "h-full",
        isMobile &&
          visibleRows &&
          threshold &&
          visibleRows.length > threshold &&
          !isAutoHeightLayout &&
          "h-[37rem]",
        (loading || !rowData.length || !isGridReady) &&
          !isAutoHeightLayout &&
          "min-h-[37rem]",
        (loading || !rowData.length || !isGridReady) &&
          isAutoHeightLayout &&
          "min-h-[12rem]"
      )}
      data-testid={testId}
    >
      <div
        className={cn("flex w-full flex-col", !isAutoHeightLayout && "flex-1")}
      >
        {loading ? (
          <div
            className="flex size-full flex-1 flex-col justify-center gap-5"
            data-testid={`${testId}-skeleton`}
          >
            <Skeleton className="w-[full] flex-1" />
          </div>
        ) : rowData.length ? (
          <>
            <div
              className={cn(
                "ag-theme-quartz rounded-xl bg-primary/10",
                !isAutoHeightLayout && "h-full",
                theme
              )}
            >
              <div
                className={cn(!isAutoHeightLayout && "h-full")}
                style={{
                  opacity: isGridReady ? 1 : 0,
                }}
              >
                <AgGridReact
                  {...props}
                  tooltipMouseTrack
                  tooltipShowMode={tooltipShowMode}
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  animateRows={false}
                  domLayout={domLayout}
                  popupParent={document.body}
                  initialState={initialState}
                  autoGroupColumnDef={autoGroupColumnDef}
                  detailCellRendererParams={detailCellRendererParams}
                  getRowId={getAgGridRowId}
                  onGridReady={handleGridReady}
                  onSortChanged={handleSortChange}
                  onFirstDataRendered={onFirstDataRendered}
                  excelStyles={excelStyles}
                  getContextMenuItems={() => []}
                  onModelUpdated={handleModelUpdated}
                />
              </div>
            </div>
            {pending && <DataGridOverlay />}
          </>
        ) : (
          <div className="flex size-full flex-1 flex-col justify-center gap-5">
            <NoDataOverlay />
          </div>
        )}
      </div>
    </div>
  );
};
