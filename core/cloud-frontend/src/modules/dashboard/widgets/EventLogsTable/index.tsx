import { ColDef, GridState } from "@ag-grid-community/core";

import { BadgeMultiSelect } from "@components/BadgeMultiSelect";
import { DataGrid, DataGridLayout } from "@components/Datagrid/index";

import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import { columnsDefinitions, defaultColumns } from "./EventLogsTable.columns";
import { data } from "./data";
import { withAppInsights } from "@/modules/app-insights/hocs/withAppInsights";
import { Selectable } from "@/typings/Selectable";
import { Icon } from "@/components/Icon/Icon";
import { useState, useMemo } from "react";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";

const allColumns = columnsDefinitions.map((column) => ({
  label: column.headerName,
  value: column.colId,
}));

const defaultCols = defaultColumns.map((column) => column);

const defaultColDef: ColDef = {
  flex: 1,
  minWidth: 150,
};
const initialState: GridState = {
  sort: {
    sortModel: [{ colId: "market_value", sort: "desc" }],
  },
};
const getRowId = (row: { event_id: number }) => String(row.event_id);

const EventLogsTableContent = () => {
  const { isMaximized } = usePanelMaximize();

  const [selectedInstrumentName, setSelectedInstrumentName] = useState<
    Selectable["value"][]
  >([]);

  const [selectedColumns, setSelectedColumns] =
    useState<Selectable["value"][]>(defaultCols);

  const handleResetColumns = () => {
    setSelectedColumns(defaultCols);
  };

  const handleChangeColumns = (value: Selectable["value"][]) => {
    setSelectedColumns(value);
  };

  const dataWithEventId = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      event_id: index,
    }));
  }, []);

  const filteredData = useMemo(() => {
    return selectedInstrumentName.length
      ? dataWithEventId.filter((item) =>
          selectedInstrumentName.includes(item.Instrument)
        )
      : dataWithEventId;
  }, [selectedInstrumentName, dataWithEventId]);

  const instrumentNames = new Set(data.map((item) => item.Instrument));

  const colDefs = useMemo(
    () =>
      columnsDefinitions.filter((column) =>
        selectedColumns.includes(column.colId)
      ),
    [selectedColumns]
  );

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({
      mode: isMaximized ? "normal" : "responsive",
    }),
    [isMaximized]
  );

  return (
    <WidgetWrapper className="event-logs-table">
      <WidgetHeader className="justify-start gap-6">
        <WidgetTitle>Event Logs</WidgetTitle>
        <WidgetActions className="w-full justify-between">
          <BadgeMultiSelect
            disablePortal
            value={selectedInstrumentName}
            options={Array.from(instrumentNames).map((label) => ({
              label,
              value: label,
            }))}
            alwaysShowPlaceholder
            placeholder="Instrument Name"
            onChange={(value) => setSelectedInstrumentName(value)}
            hasRemoveAction
            onRemoveActionClick={() => setSelectedInstrumentName([])}
          />
          <div className="flex gap-3">
            <BadgeMultiSelect
              disablePortal
              options={allColumns}
              value={selectedColumns}
              alwaysShowPlaceholder
              variant="triggerOnly"
              placeholder={<Icon name="Columns3" color="#ffffff" size="lg" />}
              handleReset={handleResetColumns}
              onChange={(value) => handleChangeColumns(value)}
            />
            <WidgetMaximizeButton />
          </div>
        </WidgetActions>
      </WidgetHeader>

      <WidgetBody>
        <DataGrid
          layout={dataGridLayout}
          rowData={filteredData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          sideBar={false}
          suppressAggFuncInHeader={true}
          animateRows={false}
          initialState={initialState}
          tooltipShowDelay={0}
          tooltipHideDelay={600000}
          getRowId={getRowId}
        />
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const EventLogsTable = withAppInsights(
  EventLogsTableContent,
  "EventLogsTable"
);
