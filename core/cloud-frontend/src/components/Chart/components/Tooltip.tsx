import { ReactNode, useMemo, useState } from "react";
import { TooltipContext } from "../context/TooltipContext";
import { ISeriesRef } from "../typings/ISeriesRef";

export interface TooltipProps {
  children?: ReactNode;
}

export const Tooltip = ({ children }: TooltipProps) => {
  const [seriesRefs, setSeriesRefs] = useState<ISeriesRef[]>([]);

  const context = useMemo(
    () => ({ seriesRefs, setSeriesRefs }),
    [seriesRefs, setSeriesRefs]
  );

  return (
    <TooltipContext.Provider value={context}>
      {children}
    </TooltipContext.Provider>
  );
};
