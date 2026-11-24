import React from "react";
import { Tooltip } from "@components/Tooltip/Tooltip";

interface PercentageBarProps {
  percentage: number;
  coefficient: number;
  isWin?: boolean;
}

const MAX_UI_VALUE = 190;

const PercentageBar: React.FC<PercentageBarProps> = ({
  percentage,
  coefficient,
  isWin = true,
}) => {
  const isLose = !isWin;
  const absValue = Math.abs(
    (Math.min(percentage, MAX_UI_VALUE) / 100) * coefficient
  );
  const isPositive = percentage > 0;

  const shouldStripColor = (isLose && isPositive) || (isWin && !isPositive);

  return (
    <div className="flex h-6 items-center justify-end">
      <div className="relative size-full">
        <div
          className={`absolute flex h-full translate-y-1/2 items-center ${
            shouldStripColor
              ? isLose
                ? "bg-red-100 bg-stripes bg-stripes-red-950"
                : "bg-green-100 bg-stripes bg-stripes-green-950"
              : isLose
                ? "right-0 bg-red-100"
                : "left-0 bg-green-100"
          } ${isLose ? "right-0" : "left-0"}`}
          style={{ width: `${absValue}%` }}
        >
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
        </div>

        {shouldStripColor && (
          <Tooltip
            trigger={<div className="absolute inset-0 translate-y-1/2 " />}
            content={
              <div className="text-sm font-medium">
                The price has already gone past your most recent estimate.
                Update your price targets to re-calculate these values.
              </div>
            }
            contentClasses="bg-neutral-800 text-white rounded max-w-[20rem] break-words border border-neutral-600 shadow-md"
            side="left"
          />
        )}
      </div>
    </div>
  );
};

export default PercentageBar;
