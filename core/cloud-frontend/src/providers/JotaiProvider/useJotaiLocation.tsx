import { useContext } from "react";
import {
  SearchParamContext,
  SearchParamContextType,
} from "./SearchParamContext";

export const useJotaiLocation = (): SearchParamContextType => {
  const context = useContext(SearchParamContext);

  if (!context) {
    throw new Error("useJotaiLocation must be used within a JotaiProvider");
  }

  return context;
};
