import { useMemo, useState } from "react";
import { ColDef, GridState } from "@ag-grid-community/core";

import { BadgeMultiSelect } from "@components/BadgeMultiSelect";
import { DataGrid, DataGridLayout } from "@components/Datagrid/index";

import { WidgetActions } from "../../../../components/Widget/WidgetActions";
import { WidgetBody } from "../../../../components/Widget/WidgetBody";
import { WidgetHeader } from "../../../../components/Widget/WidgetHeader";
import WidgetMaximizeButton from "../../../../components/Widget/WidgetMaximizeButton";
import { WidgetTitle } from "../../../../components/Widget/WidgetTitle";
import { WidgetWrapper } from "../../../../components/Widget/WidgetWrapper";
import {
  columnsDefinitions,
  defaultColumns,
} from "./CreditSummaryTable.columns";
import { data } from "./data";
import { withAppInsights } from "@/modules/app-insights/hocs/withAppInsights";
import { Selectable } from "@/typings/Selectable";
import { Icon } from "@/components/Icon/Icon";
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

const getRowId = (row: { Investment: string }) => String(row.Investment);

const CreditSummaryTableContent = () => {
  const { isMaximized } = usePanelMaximize();

  const [selectedInvestmentName, setSelectedInvestmentName] = useState<
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

  const filteredData = useMemo(() => {
    return selectedInvestmentName.length
      ? data.filter((item) => selectedInvestmentName.includes(item.Investment))
      : data;
  }, [selectedInvestmentName]);

  const investmentNames = new Set(data.map((item) => item.Investment));

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
    <WidgetWrapper>
      <WidgetHeader className="justify-start gap-6">
        <WidgetTitle>Credit Summary</WidgetTitle>
        <WidgetActions className="w-full justify-between">
          <BadgeMultiSelect
            disablePortal
            value={selectedInvestmentName}
            options={Array.from(investmentNames).map((label) => ({
              label,
              value: label,
            }))}
            alwaysShowPlaceholder
            placeholder="Investment Name"
            onChange={(value) => setSelectedInvestmentName(value)}
            hasRemoveAction
            onRemoveActionClick={() => setSelectedInvestmentName([])}
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
          getRowId={getRowId}
          tooltipShowDelay={0}
          tooltipHideDelay={600000}
        />
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const CreditSummaryTable = withAppInsights(
  CreditSummaryTableContent,
  "CreditSummaryTable"
);
