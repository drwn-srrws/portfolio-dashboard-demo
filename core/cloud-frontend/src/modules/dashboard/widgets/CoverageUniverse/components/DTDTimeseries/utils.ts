import { MetricDisplayType } from "@/api/types";
import { formatMetric } from "@/utils/metrics";
import { add, format } from "date-fns";
import * as echarts from "echarts";
import type { CallbackDataParams } from "echarts/types/dist/shared";

const TOOLTIP_CLASS_NAME = "e-charts-tooltip-style";

type EChartsLineData = {
  value: (string | number)[];
  name?: string;
};

export function createChartOption(
  data: EChartsLineData[],
  strokeColor: string
): echarts.EChartsOption {
  const firstItem = data?.[0];
  const firstItemTimestamp = firstItem?.value?.[0];

  const startTime = firstItemTimestamp
    ? new Date(firstItemTimestamp)
    : new Date();

  const endTime = add(new Date(startTime), { hours: 8 });

  const min = startTime.getTime();
  const max = endTime.getTime();

  return {
    grid: {
      top: 5,
      bottom: 5,
      left: 0,
      right: 0,
    },
    tooltip: {
      trigger: "axis",
      appendTo: "body",
      className: TOOLTIP_CLASS_NAME,

      axisPointer: {
        type: "line",
        lineStyle: {
          color: "#fff",
          width: 0.5,
        },
      },
      formatter: tooltipFormatter,
    },
    xAxis: {
      type: "time",
      show: false,
      min: min,
      max: max,
    },
    yAxis: {
      type: "value",
      show: false,
      boundaryGap: ["0%", "100%"],
      min: function (value) {
        return value.min - (value.max - value.min) * 0.5;
      },
      max: function (value) {
        return value.max + (value.max - value.min) * 0.5;
      },
    },
    series: [
      {
        type: "line",
        data,
        showSymbol: false,
        lineStyle: {
          color: strokeColor,
          width: 1.5,
        },
        areaStyle: undefined,
      },
    ],
    animation: false,
  };
}

const tooltipFormatter = (
  params: CallbackDataParams | CallbackDataParams[]
): string => {
  const p = Array.isArray(params) ? params[0] : params;

  if (!Array.isArray(p.value) || p.value.length < 6) {
    return "";
  }

  const timestamp = Number(p.value[0]);
  const price = Number(p.value[1]);
  const name = String(p.value[2]);
  const dtdDolarReturn = Number(p.value[3]);
  const dtdPercentReturn = Number(p.value[4]);
  const color = String(p.value[5]);

  if (isNaN(timestamp)) {
    return "";
  }

  const date = new Date(timestamp);
  const formattedPrice = formatMetric(price, "dollars_regular");
  const formattedDtdDollarReturn = formatMetric(
    dtdDolarReturn,
    "dollars_regular"
  );
  const formattedDtdPercentReturn = formatMetric(
    dtdPercentReturn,
    MetricDisplayType.percent
  );

  return `
    <div style="color: ${color};">
        ${name}
    </div>
    <div>
        Time: ${format(date, "HH:mm:ss")}
    <div>
        Price: ${formattedPrice}
    </div>
    <div>
        DTD Return: ${formattedDtdDollarReturn} (${formattedDtdPercentReturn})
    </div>
  `;
};
