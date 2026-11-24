import { useState, useMemo } from "react";
import { PositionDifferencesConfig } from "./usePositionDifferencesConfig";

export const usePositionDifferencesState = (
  config: PositionDifferencesConfig,
  defaultCombinationIndex: number = 0
) => {
  const [selectedFundCombination, setSelectedFundCombination] = useState<{
    fund_1: string;
    fund_2: string;
  } | null>(null);

  const effectiveFundCombination = useMemo(() => {
    if (selectedFundCombination) {
      return selectedFundCombination;
    }

    if (config.fundCombinations.length > 0) {
      return (
        config.fundCombinations[defaultCombinationIndex] ??
        config.fundCombinations[0]
      );
    }

    return { fund_1: "", fund_2: "" };
  }, [selectedFundCombination, defaultCombinationIndex, config]);

  return {
    selectedFundCombination,
    setSelectedFundCombination,
    effectiveFundCombination,
  };
};
