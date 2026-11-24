import { createContext, useContext } from "react";
import { ISeriesRef } from "../typings/ISeriesRef";

export interface ITooltipContext {
  seriesRefs: ISeriesRef[];
  setSeriesRefs: (seriesRefs: ISeriesRef[]) => void;
}

export const TooltipContext = createContext<ITooltipContext>({
  seriesRefs: [],
  setSeriesRefs: () => {},
});

export const useTooltipContext = () => useContext(TooltipContext);
