import { Fragment } from "react";
import {
  CrosshairMode,
  type LineData,
  LineStyle,
  type Time,
} from "lightweight-charts";

import {
  Chart,
  LineSeries,
  PriceScale,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/Chart";

import { DrugTrxTooltip } from "./DrugTrxTooltip";
import {
  type DrugChartLine,
  type DrugChartPoint,
  formatTrx,
} from "./PaidTrxTrendChart.utils";

const toLineData = (points: DrugChartPoint[]): LineData<Time>[] =>
  points.map((point) => ({ time: point.time as Time, value: point.value }));

const priceFormat = {
  type: "custom" as const,
  formatter: formatTrx,
  minMove: 1,
};

const DIMMED_ALPHA = 0.15;

const withAlpha = (hex: string, alpha: number): string => {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const isSinglePointSegment = (points: DrugChartPoint[]): boolean =>
  points.length === 1;

export interface DrugTrxChartProps {
  lines: DrugChartLine[];
  highlightedSource?: string | null;
}

/**
 * Weekly Paid TRx renderer built on the shared declarative `Chart` primitives.
 * Each metric is drawn as a solid actual line plus an optional dashed forecast
 * continuation and dotted prior-year overlay, all sharing the metric's color.
 */
export const DrugTrxChart = ({
  lines,
  highlightedSource,
}: DrugTrxChartProps) => {
  const highlightActive =
    !!highlightedSource && lines.some((line) => line.id === highlightedSource);

  return (
    <Chart
      resizable
      crosshair={{ mode: CrosshairMode.Normal }}
      timeScale={{ timeVisible: false, borderVisible: false }}
    >
      <PriceScale
        id="right"
        borderVisible={false}
        scaleMargins={{ top: 0.1, bottom: 0 }}
      >
        {lines.map((line) => {
          const emphasized = highlightActive && line.id === highlightedSource;
          const dimmed = highlightActive && line.id !== highlightedSource;
          const color = dimmed
            ? withAlpha(line.color, DIMMED_ALPHA)
            : line.color;

          return (
            <Fragment key={line.id}>
              {line.actual.length > 0 &&
                (line.actual.length > 1 || line.forecast.length === 0) && (
                  <Tooltip>
                    <TooltipTrigger>
                      <LineSeries
                        data={toLineData(line.actual)}
                        color={color}
                        lineWidth={emphasized ? 3 : 2}
                        lineVisible={!isSinglePointSegment(line.actual)}
                        priceFormat={priceFormat}
                        priceLineVisible={false}
                        lastValueVisible={false}
                        pointMarkersVisible={isSinglePointSegment(line.actual)}
                        priority={emphasized}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      placement={{ vertical: "top", horizontal: "right" }}
                    >
                      <DrugTrxTooltip name={line.name} color={line.color} />
                    </TooltipContent>
                  </Tooltip>
                )}
              {line.forecast.length > 0 && (
                <Tooltip>
                  <TooltipTrigger>
                    <LineSeries
                      data={toLineData(line.forecast)}
                      color={color}
                      lineWidth={emphasized ? 3 : 2}
                      lineStyle={LineStyle.Dashed}
                      lineVisible={!isSinglePointSegment(line.forecast)}
                      priceFormat={priceFormat}
                      priceLineVisible={false}
                      lastValueVisible={false}
                      pointMarkersVisible={isSinglePointSegment(line.forecast)}
                      priority={emphasized}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    placement={{ vertical: "top", horizontal: "right" }}
                  >
                    <DrugTrxTooltip name={`${line.name}`} color={line.color} />
                  </TooltipContent>
                </Tooltip>
              )}
              {line.prior.length > 1 && (
                <Tooltip>
                  <TooltipTrigger>
                    <LineSeries
                      data={toLineData(line.prior)}
                      color={color}
                      lineWidth={emphasized ? 2 : 1}
                      lineStyle={LineStyle.Dotted}
                      priceFormat={priceFormat}
                      priceLineVisible={false}
                      lastValueVisible={false}
                      priority={emphasized}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    placement={{ vertical: "top", horizontal: "right" }}
                  >
                    <DrugTrxTooltip
                      name={`${line.name} (last year)`}
                      color={line.color}
                    />
                  </TooltipContent>
                </Tooltip>
              )}
            </Fragment>
          );
        })}
      </PriceScale>
    </Chart>
  );
};
