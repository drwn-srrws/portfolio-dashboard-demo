import { IDockviewPanelProps } from "dockview-react";
import * as echarts from "echarts";
import React, { useEffect, useMemo, useRef } from "react";

import { MetricDisplayType } from "@api/types/index";
import { formatMetric } from "@/utils/metrics";
import { MetricData } from "@/utils/treemap";
import { debounce, getCSSVariableValue } from "@/utils/utils";

import { VISUAL_MAX, VISUAL_MIN } from "./utils";

interface TreemapProps {
  width?: string | number;
  height?: string | number;
  data: EchartsTreemapData[];
}

export interface EchartsTreemapData {
  name: string;
  value: [number, number]; // [sizeValueAbs, visualValue]
  colorMetric: MetricData;
  tooltipMetrics: MetricData[];
  label: { formatter: string };
}

function createChartOption(data: EchartsTreemapData[]): echarts.EChartsOption {
  return {
    tooltip: {
      className: "!p-3 !flex !flex-col !gap-3",
      formatter: (params) => {
        if (Array.isArray(params)) {
          return "";
        }

        const isRootNode = params.dataIndex === 0;
        if (isRootNode) {
          return "";
        }

        const { tooltipMetrics } = params.data as {
          tooltipMetrics: MetricData[];
        };

        return [
          `<div style="font-weight:bold;font-size:1rem;line-height:1rem;">${params.name}</div>`,
          `<div style="display:flex;flex-direction:column;gap:0.75rem;">${tooltipMetrics
            .map(
              (metric) =>
                `<span style="font-size:1rem;line-height:1rem;">${metric.display_name}: ${formatMetric(
                  metric.value,
                  metric.display_type as MetricDisplayType
                )}</span>`
            )
            .join("")}</div>`,
        ].join("");
      },
      position: (pos, _, __, ___, size) => {
        const [viewWidth, viewHeight] = (size as { viewSize: [number, number] })
          .viewSize;
        const [x, y] = pos.map(Number);

        const isBottomHalf = y > viewHeight / 2;
        const verticalOffset = isBottomHalf ? y - 100 : y + 40;

        const horizontalPosition = x < viewWidth / 2 ? "left" : "right";

        return {
          top: verticalOffset,
          [horizontalPosition]: 5,
        };
      },
    },
    series: [
      {
        type: "treemap",
        data,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: {
          show: true,
          fontSize: 10,
        },
        itemStyle: {
          borderColor: getCSSVariableValue("--neutral-800"),
          gapWidth: 2,
        },
        visualMin: VISUAL_MIN,
        visualMax: VISUAL_MAX,
        visualDimension: 1,
        levels: [
          {
            color: [
              getCSSVariableValue("--red-100"),
              "#aaa",
              getCSSVariableValue("--green-100"),
            ],
            colorMappingBy: "value",
          },
        ],
      },
    ] as echarts.SeriesOption[],
  };
}

export const Treemap: React.FC<
  TreemapProps & { panelProps: IDockviewPanelProps }
> = ({ width = "100%", height = "100%", data, panelProps }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const { containerApi } = useMemo(() => panelProps, [panelProps]);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    const handleResize = debounce(() => {
      chart.resize();
    }, 100);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartRef.current);

    const unsubscribe = containerApi.onDidLayoutChange(handleResize);

    return () => {
      chart.dispose();
      resizeObserver.disconnect();
      unsubscribe?.dispose();
    };
  }, [containerApi]);

  useEffect(() => {
    if (chartInstanceRef.current) {
      const option = createChartOption(data);
      chartInstanceRef.current.setOption(option, true);
    }
  }, [data]);

  return <div ref={chartRef} style={{ width, height }} />;
};
