import { useContext } from "react";
import { CoveragesContext } from "./CoveragesContext";

export const useCoverages = () => {
  const context = useContext(CoveragesContext);

  if (context === undefined) {
    throw new Error(
      "useCoverages must be used within a CoveragesContextProvider"
    );
  }

  return context;
};
