import { useMemo, useCallback, RefObject } from "react";
import { Sort } from "@/typings/Sort";
import { DataGrid, DataGridLayout } from "@components/Datagrid/index";
import { EventsMonitorDetailGrid } from "./EventsMonitorDetailGrid";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";
import { CompanyResponse, CompanySort } from "@/api/types";
import { GridApi } from "@ag-grid-community/core";
import { useRetrieveEventTrackerCatalog } from "@/api/endpoints/event-tracker/event-tracker";
import {
  createCompanyColumnDefs,
  defaultColDef,
} from "../../constants/columnDefs";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { useIsMobile } from "@/hooks/useMobile";

interface EventsMonitorGridProps {
  data: CompanyResponse[];
  columns: string[];
  sort: Sort<CompanySort> | null;
  pending: boolean;
  loading: boolean;
  gridRef?: RefObject<GridApi | null>;
  onSortChange: (sort: Sort<CompanySort> | null) => void;
}

const getRowId = (data: CompanyResponse) => String(data.id);

const autoSizeStrategy = {
  type: "fitGridWidth",
} as const;

export const EventsMonitorGrid = ({
  data,
  columns,
  sort,
  pending,
  loading,
  onSortChange,
  gridRef,
}: EventsMonitorGridProps) => {
  const { isMaximized } = usePanelMaximize();
  const { account } = useAuth();
  const isMobile = useIsMobile();
  const { data: eventTrackerCatalogData } = useRetrieveEventTrackerCatalog(
    {},
    {}
  );

  const columnDefs = useMemo(
    () =>
      createCompanyColumnDefs(
        columns,
        eventTrackerCatalogData?.fields,
        account,
        isMobile
      ),
    [columns, eventTrackerCatalogData?.fields, account, isMobile]
  );

  const isRowMaster = useCallback((params: CompanyResponse) => {
    void params;
    return true;
  }, []);

  const handleSortChange = useCallback(
    (newSort: Sort<string> | null) => {
      onSortChange(newSort as Sort<CompanySort> | null);
    },
    [onSortChange]
  );

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({
      mode: isMaximized ? "normal" : "responsive",
    }),
    [isMaximized]
  );

  return (
    <DataGrid
      layout={dataGridLayout}
      rowData={data}
      columnDefs={columnDefs}
      loading={loading}
      pending={pending}
      sort={sort}
      defaultColDef={defaultColDef}
      tooltipShowDelay={0}
      tooltipHideDelay={600000}
      getRowId={getRowId}
      onSortChange={handleSortChange}
      suppressCellFocus={true}
      masterDetail={true}
      isRowMaster={isRowMaster}
      detailCellRenderer={EventsMonitorDetailGrid}
      autoSizeStrategy={autoSizeStrategy}
      rowBuffer={20}
      gridRef={gridRef}
      suppressColumnVirtualisation={isMobile}
    />
  );
};
