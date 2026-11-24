import { RefObject, useEffect } from "react";
import { ISeriesRef } from "../typings/ISeriesRef";
import { useTooltipContext } from "../context/TooltipContext";
import { usePriceScaleId } from "../context/PriceScaleIdContext";

export interface UseRegisterSeriesTooltipProps {
  seriesRef: RefObject<ISeriesRef>;
}

export const useRegisterSeriesTooltip = ({
  seriesRef,
}: UseRegisterSeriesTooltipProps) => {
  const priceScaleId = usePriceScaleId();
  const { seriesRefs, setSeriesRefs } = useTooltipContext();

  useEffect(() => {
    const currentSeriesRef = seriesRef.current;

    if (!currentSeriesRef) return;

    setSeriesRefs([...seriesRefs, currentSeriesRef]);

    return () => {
      setSeriesRefs(seriesRefs.filter((ref) => ref !== currentSeriesRef));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceScaleId]);
};
