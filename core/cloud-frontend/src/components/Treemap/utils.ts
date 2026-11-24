import * as echarts from "echarts";
import { MetricData, TreemapData } from "@/utils/treemap";
import { capitalize } from "@/utils";

export const VISUAL_MIN = -100;
export const VISUAL_MAX = 100;
export const VISUAL_MIN_BOUND = -40;
export const VISUAL_MAX_BOUND = 40;

export const findMinMax = (
  data: TreemapData[]
): { min: number; max: number } => {
  return data.reduce(
    (acc, item) => ({
      min: Math.min(acc.min, item.colorMetric.value),
      max: Math.max(acc.max, item.colorMetric.value),
    }),
    { min: Infinity, max: -Infinity }
  );
};

export const calculateVisualValue = (
  value: number,
  min: number,
  max: number
): number => {
  if (value > 0) {
    return echarts.number.linearMap(
      value,
      [0, max],
      [VISUAL_MAX_BOUND, VISUAL_MAX],
      true
    );
  } else if (value < 0) {
    return echarts.number.linearMap(
      value,
      [min, 0],
      [VISUAL_MIN, VISUAL_MIN_BOUND],
      true
    );
  }
  return 0;
};

type GroupedTreemapItem = {
  id: number;
  name: string;
  data: {
    name: string;
    tooltipMetrics: MetricData[];
  }[];
};

export const exportGroupedTreemapToCSV = (
  card_name: string,
  data: GroupedTreemapItem[]
) => {
  const maxLength = Math.max(...data.map((group) => group.data.length));

  const metricNames = Array.from(
    new Set(
      data.flatMap((group) =>
        group.data.flatMap((item) =>
          item.tooltipMetrics
            .filter((metric) => metric.display_name)
            .map((metric) => metric.display_name!)
        )
      )
    )
  );

  const headers: string[] = data.flatMap((group) => [
    `${capitalize(group.name)} name`,
    ...metricNames.map(
      (metricName) => `${capitalize(group.name)} ${metricName}`
    ),
    ...(group === data[data.length - 1] ? [] : [""]),
  ]);

  const rows: Array<Array<string | number>> = Array.from(
    { length: maxLength },
    (_, rowIndex) =>
      data.flatMap((group, groupIndex) => {
        const item = group.data[rowIndex] || { name: "", tooltipMetrics: [] };

        const metricValueMap = new Map<string, string | number>(
          item.tooltipMetrics
            .filter((metric) => metric.display_name)
            .map((metric) => [metric.display_name!, metric.value])
        );

        return [
          item.name || "",
          ...metricNames.map(
            (metricName) => metricValueMap.get(metricName) ?? ""
          ),
          ...(groupIndex < data.length - 1 ? [""] : []),
        ];
      })
  );

  const allRows = [headers, ...rows];

  const csvContent = allRows
    .map((row) => row.map((cell) => JSON.stringify(cell || "")).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${card_name.replace(/[\\/:*?"<>|]/g, "_")}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
