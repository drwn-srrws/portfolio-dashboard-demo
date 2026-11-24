import { ValueFormatterParams } from "@ag-grid-community/core";

import {
  MetricCatalogItem as MetricCatalogItem,
  MetricResult,
  MetricResultDataAnyOfItem,
} from "@api/types/index";
import PercentageBar from "@/modules/dashboard/widgets/BattingAndSluggingTable/PercentageBar";
import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import { Avatar } from "@/components/Avatar";
import { ColDef } from "@ag-grid-community/core";
import { createFullPrecisionPercentTooltipProps } from "@/utils/ag-grid/tooltips";

export const battingAndSluggingDefaultColDef: ColDef = {
  resizable: true,
  flex: 1,
  field: "fieldHeader",
  headerClass: "dockview-table-header",
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

const createCustomColumns = (coefficient: number) => ({
  avg_loss_pnl_pct_nav: {
    colId: "avg_loss_pnl_pct_nav",
    headerName: "Avg Loss Performance",
    field: "avg_loss_pnl_pct_nav",
    resizable: true,
    filter: "agNumberColumnFilter",
    cellRenderer: (params: ValueFormatterParams<MetricResult>) => {
      if (!params || !params.value) return "";

      const percentageValue = params.value * 100;
      return (
        <PercentageBar percentage={percentageValue} coefficient={coefficient} />
      );
    },
    editable: false,
  },
  avg_win_pnl_pct_nav: {
    colId: "avg_win_pnl_pct_nav",
    headerName: "Avg Win Performance",
    field: "avg_win_pnl_pct_nav",
    resizable: true,
    filter: "agNumberColumnFilter",
    cellRenderer: (params: ValueFormatterParams<MetricResult>) => {
      if (!params || !params.value) return "";

      const percentageValue = params.value * 100;
      return percentageValue > 0 ? (
        <PercentageBar percentage={percentageValue} coefficient={coefficient} />
      ) : null;
    },
    editable: false,
  },
});

export const createBattingAndSluggingColumns = (
  selectedMetrics: Array<MetricCatalogItem>,
  columnsOrder: string[],
  coefficient: number
) => {
  const battingAndSluggingColumnMap = createCustomColumns(coefficient);

  const mainColumns = columnsOrder.map((key) => {
    const metric = selectedMetrics.find((metric) => metric.name === key);

    const battingAndSluggingColumn =
      battingAndSluggingColumnMap[
        key as keyof typeof battingAndSluggingColumnMap
      ];

    if (battingAndSluggingColumn) {
      return battingAndSluggingColumn;
    }

    if (metric?.name === "primary_analyst_avatar") {
      return {
        colId: metric?.name,
        headerName: metric?.display_name || key,
        field: metric?.name,
        resizable: true,
        headerTooltip: metric?.description || metric?.display_name,
        flex: 1,
        minWidth: 50,
        cellRenderer: (
          params: ValueFormatterParams<MetricResultDataAnyOfItem>
        ) => {
          if (!params.data?.primary_analyst_avatar) return "-";

          const primaryAnalystAvatar = String(
            params.data?.primary_analyst_avatar
          );

          const data = {
            email: primaryAnalystAvatar?.split("|")[0],
            first_name: primaryAnalystAvatar?.split("|")[1],
            last_name: primaryAnalystAvatar?.split("|")[2],
          };

          return (
            <div className="flex justify-center items-center w-full h-full">
              <Avatar data={data} />
            </div>
          );
        },
      };
    }

    return {
      colId: metric?.name,
      headerName: metric?.display_name || key,
      field: metric?.name,
      resizable: true,
      headerTooltip: metric?.description || metric?.display_name,
      flex: 1,
      minWidth: 50,
      valueFormatter: (params: ValueFormatterParams<MetricResult>) =>
        metric?.display_type
          ? formatMetric(params.value, metric?.display_type)
          : "",
      cellStyle: (params: ValueFormatterParams<MetricResult>) => {
        const status = getValueStatusForMetric({
          value: params.value,
          metric,
        });

        return {
          color: cellColor[status],
        };
      },
      ...createFullPrecisionPercentTooltipProps(metric),
    };
  });

  return (mainColumns as ColDef[]).flat();
};

export const createAutoGroupColumnDef = (
  metricsCatalog: MetricCatalogItem[],
  groupBy: string
) => {
  const metric = metricsCatalog.find((m) => m.name === groupBy);

  return {
    headerName: metric?.display_name || groupBy,
    headerTooltip: metric?.description || metric?.display_name || groupBy,
    colId: groupBy,
    suppressCount: false,
    minWidth: 90,
    cellRendererParams: {
      innerRenderer: (
        params: ValueFormatterParams<MetricResultDataAnyOfItem>
      ) => {
        if (groupBy === "primary_analyst") {
          const primaryAnalystAvatar = String(
            params.data?.primary_analyst_avatar
          );

          const data = {
            email: primaryAnalystAvatar?.split("|")[0],
            first_name: primaryAnalystAvatar?.split("|")[1],
            last_name: primaryAnalystAvatar?.split("|")[2],
          };
          if (params.node?.level === 0) {
            return (
              <div className="flex items-center p-2">
                <Avatar data={data} />
              </div>
            );
          }
          return params.value;
        }
        return params.value;
      },
    },
  };
};
