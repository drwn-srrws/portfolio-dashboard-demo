import { createContext, RefObject, useContext } from "react";
import { IPriceScaleRef } from "../typings/IPriceScaleRef";

export const PriceScaleRefContext =
  createContext<RefObject<IPriceScaleRef> | null>(null);

export const usePriceScaleRefContext = () => {
  const context = useContext(PriceScaleRefContext);

  if (!context) {
    throw new Error(
      "usePriceScaleRefContext must be used within a PriceScaleRefContext"
    );
  }

  return context;
};
