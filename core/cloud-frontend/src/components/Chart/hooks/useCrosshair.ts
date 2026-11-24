import { RefObject, useEffect, useState } from "react";
import {
  ISeriesApi,
  LineData,
  MouseEventParams,
  SeriesType,
  Time,
} from "lightweight-charts";
import { IChartRef } from "../typings/IChartRef";
import { IPoint } from "../context/CrosshairContext";
import { ISeriesRef } from "../typings/ISeriesRef";

export interface ICrosshairResult {
  closestPoint: IPoint | null;
  closestSeries: ISeriesApi<SeriesType> | null;
}

export interface UseCrosshairOptions {
  chartRef: RefObject<IChartRef>;
  prioritySeriesRefs?: RefObject<ISeriesRef[]>;
}

export const useCrosshair = ({
  chartRef,
  prioritySeriesRefs,
}: UseCrosshairOptions) => {
  const [result, setResult] = useState<ICrosshairResult>({
    closestPoint: null,
    closestSeries: null,
  });

  useEffect(() => {
    const currentChartRef = chartRef.current;

    if (!currentChartRef) return;

    const handleCrosshairMove = (event: MouseEventParams<Time>) => {
      const mouseX = event.point?.x ?? 0;
      const mouseY = event.point?.y ?? 0;

      let minDistance = Number.MAX_VALUE;
      let closestPoint: IPoint | null = null;
      let closestSeries: ISeriesApi<SeriesType> | null = null;

      const priorityApis = (prioritySeriesRefs?.current ?? [])
        .map((ref) => ref.api)
        .filter((api): api is ISeriesApi<SeriesType> => !!api);
      const restrictToPriority = priorityApis.some((api) =>
        event.seriesData.has(api)
      );

      for (const entry of event.seriesData.entries()) {
        const series = entry[0] as ISeriesApi<"Line">;
        const seriesData = entry[1] as LineData;

        if (restrictToPriority && !priorityApis.includes(series)) continue;

        const pointY = series.priceToCoordinate(seriesData.value) ?? 0;
        const pointX =
          currentChartRef.api?.timeScale().timeToCoordinate(seriesData.time) ??
          0;

        const distance = Math.sqrt(
          Math.pow(mouseX - pointX, 2) + Math.pow(mouseY - pointY, 2)
        );

        if (distance < minDistance) {
          closestPoint = {
            x: pointX,
            y: pointY,
            time: seriesData.time,
            value: seriesData.value,
          };
          minDistance = distance;
          closestSeries = series;
        }
      }

      setResult((result) => {
        const newResult = { closestPoint, closestSeries };

        if (
          closestPoint?.x === result.closestPoint?.x &&
          closestPoint?.y === result.closestPoint?.y &&
          closestSeries === result.closestSeries
        )
          return result;

        return newResult;
      });
    };

    currentChartRef.api?.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
      currentChartRef.api?.unsubscribeCrosshairMove(handleCrosshairMove);
    };
  }, [chartRef, prioritySeriesRefs]);

  return result;
};
