import { createContext, useContext } from "react";

export const PriceScaleIdContext = createContext<string | null>(null);

export const usePriceScaleId = () => {
  const priceScaleId = useContext(PriceScaleIdContext);

  if (!priceScaleId) {
    throw new Error("usePriceScaleId must be used within PriceScaleIdContext");
  }

  return priceScaleId;
};
