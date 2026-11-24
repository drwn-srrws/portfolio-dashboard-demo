import {
  ISeriesApi,
  LineData,
  MouseEventParams,
  Time,
} from "lightweight-charts";
import { useEffect, useState } from "react";

import { useChartContext } from "../context/MultiChartContext";

interface ExtendedSeriesApi extends ISeriesApi<"Line"> {
  extra?: { time: Time; tooltip?: string }[];
}

export interface IPoint {
  x: number;
  y: number;
}

export interface ICrosshairState {
  mouseX: number;
  mouseY: number;
  tooltip: string | null;
}

export const useCrosshair = () => {
  const { chartApi } = useChartContext();

  const [state, setState] = useState<ICrosshairState>({
    mouseX: 0,
    mouseY: 0,
    tooltip: null,
  });

  useEffect(() => {
    const handleCrosshairMove = (event: MouseEventParams<Time>) => {
      const mouseX = event.point?.x ?? 0;
      const mouseY = event.point?.y ?? 0;

      let coords: IPoint | null = null;
      let minDistance = Number.MAX_VALUE;
      let tooltip: string | null = null;

      for (const entry of Array.from(event.seriesData.entries())) {
        const series = entry[0] as ExtendedSeriesApi;
        const seriesData = entry[1] as LineData;

        const pointY = series.priceToCoordinate(seriesData.value) ?? 0;
        const pointX =
          chartApi.timeScale().timeToCoordinate(seriesData.time) ?? 0;

        const distance = Math.sqrt(
          Math.pow(mouseX - pointX, 2) + Math.pow(mouseY - pointY, 2)
        );

        if (distance < minDistance) {
          coords = { x: pointX, y: pointY };
          minDistance = distance;
          tooltip =
            series.extra?.find((item) => item.time === seriesData.time)
              ?.tooltip ?? null;
        }
      }

      setState({
        mouseX: coords?.x ?? 0,
        mouseY: coords?.y ?? 0,
        tooltip,
      });
    };

    chartApi.subscribeCrosshairMove(handleCrosshairMove);

    return () => chartApi.unsubscribeCrosshairMove(handleCrosshairMove);
  }, [chartApi]);

  return { ...state };
};
