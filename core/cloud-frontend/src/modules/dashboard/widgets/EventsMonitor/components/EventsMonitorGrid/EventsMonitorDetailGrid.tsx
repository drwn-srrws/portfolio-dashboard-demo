import { useMemo, useRef } from "react";
import { GridApi } from "@ag-grid-community/core";

import {
  CompanyResponse,
  CompanyResponsePrimaryAnalyst,
  CompanyEventResponse,
} from "@/api/types";
import { DataGrid } from "@/components/Datagrid/Datagrid";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/Icon/Icon";
import { useStore } from "@/store";
import { Dialogs } from "@/store/slices/dialogsSlice";
import {
  createEventColumnDefs,
  defaultDetailColDef,
} from "../../constants/columnDefs";
import { PrefilledEventData } from "../../cells/EventCell";
import { useRetrieveEventTrackerCatalog } from "@/api/endpoints/event-tracker/event-tracker";
import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { isPortfolioManagerReadOnly } from "@/utils/roleUtils";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

interface EventsMonitorDetailGridProps {
  data: CompanyResponse;
}

export type ExtendedEventResponse = CompanyEventResponse & {
  company_name: string;
  company_id: number;
  primary_analyst?: CompanyResponsePrimaryAnalyst;
};

export const EventsMonitorDetailGrid = ({
  data,
}: EventsMonitorDetailGridProps) => {
  const gridRef = useRef<GridApi | null>(null);
  const { updateDialog } = useStore();
  const { account } = useAuth();
  const readOnly = isPortfolioManagerReadOnly(account?.roles);
  const { data: catalog } = useRetrieveEventTrackerCatalog({}, {});
  const { isFeatureEnabled } = useFeatureFlags();
  const isIvolEnabled = isFeatureEnabled("enableIvolImpliedMove");

  const rows: ExtendedEventResponse[] = useMemo(() => {
    const events = (data?.events || []) as CompanyEventResponse[];
    return events.map((event) => ({
      ...event,
      company_name: data.name,
      company_id: data.id,
      primary_analyst: data.primary_analyst,
    }));
  }, [data]);

  const handleCreateClick = () => {
    const prefilled: PrefilledEventData = {
      id: null,
      companyName: data?.name || "",
      companyId: data?.id || null,
      name: null,
      eventType: null,
      eventClassification: null,
      eventImpact: null,
      dateShape: "date",
      date: new Date(),
      rangeWeeks: 0,
      description: "",
      workstreamDescription: "",
      hasPassed: false,
    };

    updateDialog({
      dialog: Dialogs.openEventDetailDialog,
      status: true,
      prefilled,
    });
  };

  return (
    <section className="flex h-full flex-col px-2 pb-4 pt-1">
      <header className="flex items-center justify-between pb-2">
        <div className="text-sm text-neutral-400">{data?.name} — Events</div>
        {!readOnly && (
          <Button
            variant="ghost"
            onClick={handleCreateClick}
            className="border border-neutral-700"
          >
            <span className="flex gap-2 items-center text-[0.875rem]">
              <Icon name="CirclePlus" color="currentColor" size="md" />
              <span>Create New Event</span>
            </span>
          </Button>
        )}
      </header>
      <div className="flex-1">
        <DataGrid<ExtendedEventResponse>
          rowData={rows}
          columnDefs={createEventColumnDefs(catalog?.fields, isIvolEnabled)}
          defaultColDef={defaultDetailColDef}
          layout={{ mode: "normal" }}
          gridRef={gridRef}
          getRowId={(row) => String(row.id)}
          getRowClass={(params) =>
            params.data?.is_passed ? "event-passed" : "event-not-passed"
          }
          pending={false}
        />
      </div>
    </section>
  );
};
