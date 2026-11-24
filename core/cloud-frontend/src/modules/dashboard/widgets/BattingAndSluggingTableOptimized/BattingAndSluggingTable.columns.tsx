import { ColDef, ValueFormatterParams } from "@ag-grid-community/core";

import { AnalystStats, MetricCatalogItem } from "@api/types/index";
import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { Avatar } from "@/components/Avatar";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";
import { parseAvatar } from "./BattingAndSluggingTable.utils";

export const battingAndSluggingDefaultColDef: ColDef = {
  resizable: true,
  flex: 1,
  field: "fieldHeader",
  headerClass: "dockview-table-header",
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

export const createBattingAndSluggingColumns = (
  displayColumns: string[] = [],
  groupByFields: string[],
  metricsCatalog: MetricCatalogItem[] = []
): ColDef[] => {
  const columnsToRender = displayColumns.filter((col) => {
    if (groupByFields.includes(col)) return false;
    if (col.endsWith("_avatar")) return false;
    return true;
  });

  return columnsToRender.map((columnName) => {
    const metric = metricsCatalog?.find((m) => m.name === columnName);

    return {
      colId: columnName,
      headerName: metric?.display_name || columnName,
      headerTooltip: metric?.description || metric?.display_name || columnName,
      field: columnName,
      resizable: true,
      flex: 1,
      minWidth: 50,
      valueFormatter: (params: ValueFormatterParams<AnalystStats>) =>
        metric?.display_type
          ? formatMetric(params.value, metric.display_type)
          : params.value,
      cellStyle: (params: ValueFormatterParams<AnalystStats>) => {
        if (!metric?.display_type) return null;
        const status = getValueStatusForMetric({ value: params.value, metric });
        return { color: cellColor[status] };
      },
      ...createFullPrecisionPercentTooltipProps(metric),
    };
  });
};

export const createAutoGroupColumnDef = (
  groupByFields: string[],
  metricsCatalog: MetricCatalogItem[] = []
) => {
  const rootGroupField = groupByFields[0] || "Group";
  const metric = metricsCatalog?.find((m) => m.name === rootGroupField);
  const displayName = metric?.display_name || rootGroupField;

  return {
    headerName: displayName,
    headerTooltip: metric?.description || displayName,
    colId: rootGroupField,
    minWidth: 90,
    cellRendererParams: {
      innerRenderer: (params: ValueFormatterParams<AnalystStats>) => {
        const level = params.node?.level ?? 0;
        const levelField = groupByFields[level];

        if (levelField === "primary_analyst") {
          const avatar = parseAvatar(params.data?.primary_analyst_avatar);
          if (avatar) {
            return (
              <div className="flex items-center p-2">
                <Avatar data={avatar} />
              </div>
            );
          }
        }
        return params.value;
      },
    },
  };
};
