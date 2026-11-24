import { ValueGetterParams } from "@ag-grid-community/core";
import * as echarts from "echarts";
import { Time, isBusinessDay } from "lightweight-charts";
import React, { useEffect, useRef, useMemo, memo } from "react";
import { CompanyRow } from "../../helpers/mapCompaniesToRows";
import { createChartOption } from "./utils";
import { Icon } from "@/components/Icon/Icon";

const timeToTimestamp = (time: Time): number => {
  if (isBusinessDay(time)) {
    return new Date(time.year, time.month - 1, time.day).getTime();
  }
  return Number(time) * 1000;
};

export const DTDTimeseries: React.FC<{
  data: [Time, number][];
  params: ValueGetterParams<CompanyRow>;
  isLoading: boolean;
}> = memo(
  ({ data, params, isLoading }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<echarts.ECharts | null>(null);

    const width = 118;
    const height = 29;

    const calculatedValues = useMemo(() => {
      const eodDtdDollarReturn = params.data?.dtd_dollar_return_bbg || 0;
      const eodDtdPercentReturn = params.data?.dtd_percent_return_bbg || 0;

      const realTimeData = params.data?.realtimePriceHistory;
      const realTimeLatestEntry = realTimeData?.[realTimeData.length - 1];

      const realtimeDtdDollarReturn =
        realTimeLatestEntry?.dtd_daily_return || 0;
      const realtimeDtdPercentReturn =
        realTimeLatestEntry?.dtd_percent_return || 0;

      const dtdDolarReturn = realTimeLatestEntry
        ? realtimeDtdDollarReturn
        : eodDtdDollarReturn;
      const dtdPercentReturn = realTimeLatestEntry
        ? realtimeDtdPercentReturn
        : eodDtdPercentReturn;

      const color = dtdPercentReturn >= 0 ? "#2EAE5C" : "#E03C31";

      return { dtdDolarReturn, dtdPercentReturn, color };
    }, [
      params.data?.dtd_dollar_return_bbg,
      params.data?.dtd_percent_return_bbg,
      params.data?.realtimePriceHistory,
    ]);

    const { dtdDolarReturn, dtdPercentReturn, color } = calculatedValues;

    const newData = useMemo(() => {
      if (!data || data.length === 0) return [];

      return data.map(([time, price]) => ({
        value: [
          timeToTimestamp(time),
          price,
          params.data?.name || "",
          dtdDolarReturn,
          dtdPercentReturn,
          color,
        ],
        name: params.data?.name,
      }));
    }, [data, params.data?.name, dtdDolarReturn, dtdPercentReturn, color]);

    useEffect(() => {
      if (!chartRef.current) return;
      chartInstanceRef.current = echarts.init(chartRef.current);
      return () => {
        chartInstanceRef.current?.dispose();
      };
    }, []);

    useEffect(() => {
      if (!chartInstanceRef.current || !newData.length) return;

      const option = createChartOption(newData, color);

      chartInstanceRef.current.setOption(option, {
        notMerge: false,
        lazyUpdate: true,
        silent: true,
      });
    }, [newData, color]);

    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-start">
          <Icon
            name="Loader"
            size="md"
            color="currentColor"
            className="animate-spin"
          />
        </div>
      );
    }

    return (
      <div>
        <div ref={chartRef} style={{ width, height }} />
        <div
          id="echarts-tooltip-container"
          style={{ position: "absolute", zIndex: 9999 }}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;

    if (prevProps.data.length !== nextProps.data.length) return false;

    return true;
  }
);
