import { SquareMousePointer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useMemo } from "react";

import { useCompanyPageEvents } from "@/hooks/api/useCompanyPageEvents";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
import { DataGrid, DataGridLayout } from "@components/Datagrid/index";
import { Button } from "@components/ui";
import { sortStringDates } from "@/utils/index";

import Card from "../Card/Card";
import { eventsColDefs } from "./EventsTable.utils";
import { routes } from "@/utils/routes";

const EventsTableContent = () => {
  const params = useParams();
  const { companyId } = params;

  const navigate = useNavigate();

  const { events, isLoading } = useCompanyPageEvents(Number(companyId));

  const eventsColumns = useMemo(() => eventsColDefs, []);
  const eventsData = useMemo(() => {
    return events?.sort((a, b) => sortStringDates(a.date, b.date)) || [];
  }, [events]);

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({
      mode: "responsive",
    }),
    []
  );

  return (
    <Card
      title="Events"
      className="w-full min-w-full"
      actions={
        <Button
          variant="link"
          className="relative z-[2] ml-2 h-auto p-0"
          onClick={() => navigate(routes.eventTrackerNew())}
        >
          <SquareMousePointer className="size-4" />
        </Button>
      }
    >
      <div className="flex-1">
        <DataGrid
          layout={dataGridLayout}
          rowData={eventsData}
          columnDefs={eventsColumns}
          loading={isLoading}
          defaultColDef={{}}
          getRowId={(row) => String(row.id)}
        />
      </div>
    </Card>
  );
};

export const EventsTable = withAppInsights(EventsTableContent, "EventsTable");
