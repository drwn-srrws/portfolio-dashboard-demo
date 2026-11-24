import { useMemo } from "react";
import { formatMetric } from "@utils/metrics";
import { cn, getCSSVariableValue } from "@/utils";
import { Treemap, TreemapNode, TreemapOptions } from "../Treemap";

export interface CoverageTreemapProps {
  data: TreemapNode[];
  className?: string;
  sizeMetric?: string;
}

export const CoverageTreemap = ({
  data,
  className,
  sizeMetric = "market_cap_bbg",
}: CoverageTreemapProps) => {
  const treemapOptions = useMemo(
    () => createCoverageTreemapOptions(sizeMetric),
    [sizeMetric]
  );

  return (
    <div
      className={cn(
        "w-full h-full border-[1rem] bg-neutral-900 border-neutral-900",
        className
      )}
      data-testid="coverage-distribution-treemap"
    >
      <Treemap
        data={data}
        options={treemapOptions}
        chartOptions={{ tooltip: {} }}
      />
    </div>
  );
};

const createCoverageTreemapOptions = (sizeMetric: string): TreemapOptions => {
  const isMarketCap =
    sizeMetric === "market_cap_bbg" || sizeMetric === "market_cap";
  const metricLabel = isMarketCap ? "Market Cap" : "Number of Companies";

  return {
    tooltip: {
      show: true,
      trigger: "item",
      triggerOn: "mousemove",
      formatter: ({ name, value }) => {
        const formattedValue = isMarketCap
          ? `$${formatMetric(value ?? 0, "dollars")}`
          : (value ?? 0).toLocaleString();
        return `
        <div style="display:flex;flex-direction:column;gap:0.5rem;">
          <div style="font-weight:bold;font-size:1rem;line-height:1rem;">${name}</div>
          <div style="font-size:0.875rem;line-height:0.875rem;">${metricLabel}: ${formattedValue}</div>
        </div>
        `;
      },
    },
    label: {
      position: "inside",
      formatter: ({ name, value }) => {
        const formattedValue = isMarketCap
          ? `$${formatMetric(value ?? 0, "dollars")}`
          : (value ?? 0).toLocaleString();
        return `{name|${name}}\n{value|${formattedValue}}`;
      },
      rich: {
        name: {
          fontWeight: "bold",
          fontSize: 10,
          padding: [0, 0, 5, 0],
        },
        value: { fontSize: 10 },
      },
    },
    labelLayout: ({ labelRect }) => ({
      y: labelRect.y,
      align: "center",
    }),
    nodeStyle: {
      color: getCSSVariableValue("--neutral-800"),
    },
    itemStyle: {
      borderWidth: 2,
      borderColor: getCSSVariableValue("--neutral-900"),
    },
  };
};
