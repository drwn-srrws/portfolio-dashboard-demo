import { ColDef, ValueFormatterParams } from "@ag-grid-community/core";
import { format } from "date-fns";

import { cellColor } from "@/utils/ag-grid/cells";
import { formatMetric, getValueStatusForMetric } from "@/utils/metrics";
import {
  MetricCatalogItem,
  MetricResult,
  MetricResultDataAnyOfItem,
} from "@api/types/index";

import PercentageBar from "./PercentageBar";
import { parseDateString } from "@/utils";
import { Avatar } from "@components/Avatar";
import { SoftDateCell } from "@/components/SoftDateCell";
import { EventHorizonType } from "@/api/types/eventHorizonType";

const defaultStyle = {
  display: "flex",
  alignItems: "center",
  height: "100%",
};

export const defaultColDef = {
  flex: 1,
  minWidth: 150,
  resizable: true,
  suppressHeaderMenuButton: true,
  suppressHeaderFilterButton: true,
};

const getMetricData = (catalog: Array<MetricCatalogItem>, key: string) => {
  const metric = catalog.find((metric) => metric.name === key);
  return metric;
};

const createCustomEventColumns = (catalog: Array<MetricCatalogItem>) => {
  return {
    estimate: {
      headerName: "Estimate",
      field: "estimate",
      width: "fit-content",
      flex: 0,
      cellRenderer: (
        params: ValueFormatterParams<MetricResultDataAnyOfItem>
      ) => {
        const left = params.data?.event_estimate_downside_price_move_percent as
          | number
          | undefined;

        const right = params.data?.event_estimate_upside_price_move_percent as
          | number
          | undefined;

        const eventEstimateId = params.data?._event_estimate_id as
          | string
          | undefined;

        if (!eventEstimateId) {
          return null;
        }

        if (left == null || right == null) return null;

        return (
          <div className="flex w-[160px] items-center">
            <div className="w-[80px]">
              <PercentageBar
                percentage={left * 100}
                coefficient={70}
                isWin={false}
              />
            </div>
            <div className="w-[80px]">
              <PercentageBar
                percentage={right * 100}
                coefficient={70}
                isWin={true}
              />
            </div>
          </div>
        );
      },
    },
    date: {
      headerName: getMetricData(catalog, "date")?.display_name,
      headerTooltip: getMetricData(catalog, "date")?.description,
      field: "date",
      minWidth: 55,
      valueFormatter: (params: ValueFormatterParams<MetricResult>) => {
        if (!params.value) return "";
        const date = parseDateString(params.value);

        if (!date) return "";

        return format(date, "MMM d");
      },
      cellRenderer: (
        params: ValueFormatterParams<MetricResultDataAnyOfItem>
      ) => {
        if (!params.value) return "";
        const date = parseDateString(params.value as string | Date);

        if (!date) return "";

        const formatted = format(date, "MMM d");

        const startDate = params.data?.event_start_date;
        const endDate = params.data?.event_end_date;
        const horizonType = params.data?.event_horizon_type;

        const horizon =
          startDate && endDate && horizonType
            ? {
                start_date: String(startDate),
                end_date: String(endDate),
                horizon_type: horizonType as EventHorizonType,
              }
            : null;

        return <SoftDateCell formatted={formatted} horizon={horizon} />;
      },
      cellStyle: {
        ...defaultStyle,
      },
    },
    primary_analyst_avatar: {
      headerName: getMetricData(catalog, "primary_analyst_avatar")
        ?.display_name,
      field: "primary_analyst_avatar",

      maxWidth: 75,
      cellRenderer: (
        params: ValueFormatterParams<MetricResultDataAnyOfItem>
      ) => {
        if (!params.data?.primary_analyst_avatar) {
          return "-";
        }

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
    },
  };
};

export const createEventColumns = (
  selectedMetrics: Array<MetricCatalogItem>,
  columnsOrder: string[]
) => {
  const customEventColumns = createCustomEventColumns(selectedMetrics);

  const mainColumns = columnsOrder.map((key) => {
    const metric = selectedMetrics.find((metric) => metric.name === key);

    const column = customEventColumns[key as keyof typeof customEventColumns];

    if (column) {
      return column;
    }

    return {
      colId: metric?.name,
      headerName: metric?.display_name || key,
      field: metric?.name,
      resizable: true,
      headerTooltip: metric?.description || metric?.display_name,
      minWidth: key.includes("actual_nav_impact") ? 60 : undefined,
      valueFormatter: (params: ValueFormatterParams<MetricResult>) => {
        return metric?.display_type
          ? formatMetric(params.value, metric?.display_type)
          : "";
      },
      cellStyle: (params: ValueFormatterParams<MetricResult>) => {
        const status = getValueStatusForMetric({
          value: params.value,
          metric,
        });

        return {
          ...defaultStyle,
          color: cellColor[status],
        };
      },
    };
  });

  return (mainColumns as ColDef[])
    .map((column) => ({
      ...column,
      cellClass: (params: ValueFormatterParams<MetricResultDataAnyOfItem>) => {
        return params.data?.event_is_passed
          ? "event-passed"
          : "event-not-passed";
      },
    }))
    .flat();
};
