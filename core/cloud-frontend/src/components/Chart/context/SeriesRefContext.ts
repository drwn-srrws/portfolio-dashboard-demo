import { createContext, RefObject, useContext } from "react";
import { ISeriesRef } from "../typings/ISeriesRef";

export const SeriesRefContext =
  createContext<RefObject<ISeriesRef | null> | null>(null);

export const useSeriesRefContext = () => {
  const seriesRef = useContext(SeriesRefContext);

  if (!seriesRef) {
    throw new Error("SeriesRefContext not found");
  }

  return seriesRef;
};
