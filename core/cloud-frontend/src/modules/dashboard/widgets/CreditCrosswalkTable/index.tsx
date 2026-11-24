import { useMemo, useState } from "react";

import { NoDataOverlay } from "@components/Overlay/NoDataOverlay";
import { BadgeMultiSelect } from "@components/BadgeMultiSelect";
import { withAppInsights } from "@modules/app-insights/hocs/withAppInsights";
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
} from "./CreditCrosswalkTable.columns";
import { data } from "./data";
import { Icon } from "@/components/Icon/Icon";
import { usePanelMaximize } from "@/hooks/usePanelMaximize";

const allColumns = columnsDefinitions.map((column) => ({
  label: column.headerName,
  value: column.colId,
}));

const defaultCols = defaultColumns.map((column) => column);

const CreditCrosswalkTableContent = () => {
  const { isMaximized } = usePanelMaximize();

  const [selectedInstrumentName, setSelectedInstrumentName] = useState<
    string[]
  >([]);

  const [selectedColumns, setSelectedColumns] = useState<string[]>(defaultCols);

  const handleResetColumns = () => {
    setSelectedColumns(defaultCols);
  };

  const handleChangeColumns = (value: string[]) => {
    setSelectedColumns(value);
  };

  const dataGridLayout: DataGridLayout = useMemo(
    () => ({
      mode: isMaximized ? "normal" : "responsive",
    }),
    [isMaximized]
  );

  return (
    <WidgetWrapper>
      <WidgetHeader className="justify-start gap-6">
        <WidgetTitle>Credit Crosswalk</WidgetTitle>
        <WidgetActions className="w-full justify-between">
          <BadgeMultiSelect
            disablePortal
            value={selectedInstrumentName}
            options={allColumns}
            alwaysShowPlaceholder
            placeholder="Instrument Name"
            onChange={(value) => setSelectedInstrumentName(value.map(String))}
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
              onChange={(value) => handleChangeColumns(value.map(String))}
            />
            <WidgetMaximizeButton />
          </div>
        </WidgetActions>
      </WidgetHeader>

      <WidgetBody>
        {!data.length ? (
          <NoDataOverlay />
        ) : (
          <DataGrid
            layout={dataGridLayout}
            rowData={data}
            columnDefs={columnsDefinitions.filter((column) =>
              selectedColumns.includes(column.colId)
            )}
            autoSizeStrategy={{
              type: "fitCellContents",
            }}
            sideBar={false}
            suppressAggFuncInHeader={true}
            animateRows={false}
            initialState={{
              sort: {
                sortModel: [
                  {
                    colId: "market_value",
                    sort: "desc",
                  },
                ],
              },
            }}
            tooltipShowDelay={0}
            tooltipHideDelay={600000}
            getRowId={(data) => data.abbrevName}
          />
        )}
      </WidgetBody>
    </WidgetWrapper>
  );
};

export const CreditCrosswalkTable = withAppInsights(
  CreditCrosswalkTableContent,
  "CreditCrosswalkTable"
);
