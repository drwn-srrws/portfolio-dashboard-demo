import { memo, useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useEchart } from "@hooks/useEchart";
import { cn } from "@/utils";

export type TreemapNode = NonNullable<
  echarts.TreemapSeriesOption["data"]
>[number];

export type TreemapOptions = echarts.TreemapSeriesOption & {
  nodeStyle?: TreemapNode["itemStyle"];
};

export interface TreemapProps {
  data: TreemapNode[];
  options?: TreemapOptions;
  className?: string;
  chartOptions?: echarts.EChartsOption;
}

export const Treemap = memo(
  ({ data, options, chartOptions, className }: TreemapProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { chart } = useEchart({ containerRef });

    useEffect(() => {
      if (!chart) return;

      const enhancedData = data.map((node) => ({
        ...node,
        itemStyle: { ...node.itemStyle, ...options?.nodeStyle },
      }));

      chart.setOption<echarts.EChartsOption>({
        ...chartOptions,
        series: [
          {
            type: "treemap",
            data: enhancedData,
            roam: false,
            nodeClick: false,
            cursor: "default",
            breadcrumb: { show: false },
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            ...options,
          },
        ],
      });
    }, [chart, chartOptions, data, options]);

    return <div ref={containerRef} className={cn("size-full", className)} />;
  }
);
