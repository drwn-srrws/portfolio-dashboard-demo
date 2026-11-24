import { RefObject, useEffect } from "react";
import { ISeriesRef } from "../typings/ISeriesRef";
import { useCrosshairPriorityContext } from "../context/CrosshairPriorityContext";
import { usePriceScaleId } from "../context/PriceScaleIdContext";

export interface UseRegisterSeriesPriorityProps {
  seriesRef: RefObject<ISeriesRef>;
  priority?: boolean;
}

export const useRegisterSeriesPriority = ({
  seriesRef,
  priority,
}: UseRegisterSeriesPriorityProps) => {
  const priceScaleId = usePriceScaleId();
  const context = useCrosshairPriorityContext();

  useEffect(() => {
    if (!priority || !context) return;

    const currentSeriesRef = seriesRef.current;

    if (!currentSeriesRef) return;

    context.registerPriority(currentSeriesRef);

    return () => {
      context.unregisterPriority(currentSeriesRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceScaleId, priority]);
};
