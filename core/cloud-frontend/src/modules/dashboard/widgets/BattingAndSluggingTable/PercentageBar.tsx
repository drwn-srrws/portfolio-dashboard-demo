import React from "react";

interface PercentageBarProps {
  percentage: number;
  coefficient: number;
}

const PercentageBar: React.FC<PercentageBarProps> = ({
  percentage,
  coefficient,
}) => {
  const isNegative = percentage <= 0;
  const absValue = Math.abs((percentage / 100) * coefficient);

  const isTiny = absValue < 20;

  return (
    <div className="flex h-6 items-center justify-end">
      <div className="relative size-full">
        <div
          className={`absolute right-0 flex h-full translate-y-1/2 items-center ${
            isNegative ? "right-0 bg-red-100" : "left-0 bg-green-100"
          }`}
          style={{ width: `${absValue}%` }}
        >
          <div
            style={{
              width: `${isTiny ? 20 : 100}%`,
              minWidth: "fit-content",
              position: "absolute",
            }}
            className={`${isNegative ? `${isTiny ? "right-[15px]" : "right-0"}` : `${isTiny ? "left-[15px]" : "left-0"}`}`}
          >
            <span className={`w-full px-1 text-sm text-white opacity-0`}>
              {percentage.toFixed(4)}%
            </span>

            <span
              className={`absolute px-1 text-sm text-white ${
                isNegative ? "ml-1 text-left" : "mr-1 text-right"
              } ${isNegative ? "left-0 text-left" : "right-0 text-right"} top-[-2px] w-full translate-y-1/2 `}
            >
              {percentage.toFixed(4)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PercentageBar;
