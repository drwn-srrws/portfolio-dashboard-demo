import { createContext, useContext } from "react";
import { ISeriesApi, SeriesType, Time } from "lightweight-charts";

export interface IPoint {
  x: number;
  y: number;
  time: Time;
  value: number;
}

export interface ICrosshairContext {
  closestPoint: IPoint | null;
  closestSeries: ISeriesApi<SeriesType> | null;
}

export const CrosshairContext = createContext<ICrosshairContext | null>(null);

export const useCrosshairContext = () => {
  const context = useContext(CrosshairContext);

  if (!context) {
    throw new Error(
      "useCrosshairContext must be used within a CrosshairProvider"
    );
  }

  return context;
};
