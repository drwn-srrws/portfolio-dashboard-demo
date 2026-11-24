import { memo, useCallback, useMemo, useState } from "react";
import {
  CrosshairMode,
  LineData,
  Time,
  DeepPartial,
  TimeScaleOptions,
} from "lightweight-charts";
import { MetricDisplayType } from "@api/types";
import {
  Chart,
  PriceScale,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/Chart";
import { MetricChartTooltip } from "./MetricChartTooltip";
import { MetricChartOverlay } from "./MetricChartOverlay";
import { Legend, ILegendOption } from "../../Legend";
import { MetricSeries } from "./MetricSeries";
import { cn } from "@/utils";

export interface IMetricChartSeries {
  id: string;
  name: string;
  color: string;
  metricDisplayType: MetricDisplayType;
  data: LineData<Time>[];
}

export interface MetricChartProps {
  disableTooltip?: boolean;
  disabledLegendValues?: string[];
  data: IMetricChartSeries[];
  priceScale?: "right" | "left";
  maxVisibleLegends?: number;
  className?: string;
  pending?: boolean;
  timeScale?: DeepPartial<TimeScaleOptions>;
  onDisabledLegendValuesChange?: (values: string[]) => void;
}

export const MetricChart = memo(
  ({
    disableTooltip,
    disabledLegendValues: propDisabledLegendValues,
    data,
    className,
    priceScale = "right",
    maxVisibleLegends = 5,
    pending,
    timeScale,
    onDisabledLegendValuesChange,
  }: MetricChartProps) => {
    const [_disabledLegendValues, _setDisabledLegendValues] = useState<
      string[]
    >([]);

    const disabledLegendValues =
      propDisabledLegendValues ?? _disabledLegendValues;

    const isDisabledLegendValuesControlled = !!propDisabledLegendValues;

    const legendOptions = useMemo(() => {
      const legendOptions: ILegendOption[] = data.map((item) => ({
        value: item.name,
        label: item.name,
        color: item.color,
      }));

      return legendOptions;
    }, [data]);

    const shownSeries = useMemo(() => {
      return data.filter((item) => !disabledLegendValues.includes(item.name));
    }, [data, disabledLegendValues]);

    const setDisabledLegendValues = useCallback(
      (values: string[]) => {
        if (!isDisabledLegendValuesControlled) _setDisabledLegendValues(values);
        onDisabledLegendValuesChange?.(values);
      },
      [isDisabledLegendValuesControlled, onDisabledLegendValuesChange]
    );

    return (
      <div className={cn("flex flex-col gap-2 size-full", className)}>
        <Legend
          options={legendOptions}
          disabledValues={disabledLegendValues}
          maxVisibleItems={maxVisibleLegends}
          onDisabledValuesChange={setDisabledLegendValues}
        />
        <div className="relative flex-1">
          <Chart
            resizable
            crosshair={{
              mode: CrosshairMode.Normal,
              vertLine: {
                labelVisible: false,
              },
            }}
            timeScale={timeScale}
          >
            {!!shownSeries.length && (
              <PriceScale id={priceScale}>
                {shownSeries.map((series) =>
                  disableTooltip ? (
                    <MetricSeries key={series.id} data={series} />
                  ) : (
                    <Tooltip key={series.id}>
                      <TooltipTrigger>
                        <MetricSeries data={series} />
                      </TooltipTrigger>
                      {!disableTooltip && (
                        <TooltipContent
                          placement={{ vertical: "top", horizontal: "right" }}
                        >
                          <MetricChartTooltip series={series} />
                        </TooltipContent>
                      )}
                    </Tooltip>
                  )
                )}
              </PriceScale>
            )}
          </Chart>
          {pending && <MetricChartOverlay />}
        </div>
      </div>
    );
  }
);
