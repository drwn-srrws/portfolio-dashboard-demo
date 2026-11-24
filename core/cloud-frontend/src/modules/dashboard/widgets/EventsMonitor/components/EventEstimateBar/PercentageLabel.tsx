import React from "react";

interface PercentageLabelProps {
  percentage: number;
  isLose: boolean;
  isPositive: boolean;
}

const PercentageLabel: React.FC<PercentageLabelProps> = ({
  percentage,
  isLose,
  isPositive,
}) => {
  return (
    <div
      style={{
        width: `100%`,
        minWidth: "fit-content",
        position: "absolute",
      }}
      className={`${isLose ? "right-[0.5rem]" : "left-[0.5rem]"}`}
    >
      <span className={`w-full px-1 text-sm text-white opacity-0`}>
        {percentage.toFixed(2)}%
      </span>

      <span
        className={`absolute px-1 text-sm text-white ${
          isLose ? "ml-1 text-left" : "mr-1 text-right"
        } ${isLose ? "left-0 text-left" : "right-0 text-right"} top-1/2 -translate-y-1/2`}
      >
        {isPositive && "+"}
        {percentage.toFixed(2)}%
      </span>
    </div>
  );
};

export default PercentageLabel;
