import React from "react";
import PercentageLabel from "./PercentageLabel";

interface EstimateBarVisualProps {
  absValue: number;
  percentage: number;
  isLose: boolean;
  isPositive: boolean;
}

const EstimateBarVisual: React.FC<EstimateBarVisualProps> = ({
  absValue,
  percentage,
  isLose,
  isPositive,
}) => {
  return (
    <div
      className={`absolute flex h-full translate-y-1/2 items-center ${
        isLose ? "right-0 bg-red-100" : "left-0 bg-green-100"
      }`}
      style={{ width: `${absValue}%` }}
    >
      <PercentageLabel
        percentage={percentage}
        isLose={isLose}
        isPositive={isPositive}
      />
    </div>
  );
};

export default EstimateBarVisual;
