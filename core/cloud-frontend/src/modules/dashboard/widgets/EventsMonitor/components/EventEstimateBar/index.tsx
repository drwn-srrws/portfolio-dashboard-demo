import React from "react";
import { Tooltip } from "@components/Tooltip/Tooltip";
import { EventEstimateBarProps, MAX_UI_VALUE } from "./types";
import EstimateTooltipContent from "./EstimateTooltipContent";
import EstimateBarVisual from "./EstimateBarVisual";

const EventEstimateBar: React.FC<EventEstimateBarProps> = ({
  percentage,
  coefficient,
  isWin = true,
  allEstimates,
}) => {
  const isLose = !isWin;
  const absValue = Math.abs(
    (Math.min(percentage, MAX_UI_VALUE) / 100) * coefficient
  );
  const isPositive = percentage > 0;

  const renderTooltipContent = () => {
    if (!allEstimates || allEstimates.length === 0) return null;

    return (
      <EstimateTooltipContent allEstimates={allEstimates} isUpside={isWin} />
    );
  };

  return (
    <div className="flex h-6 items-center justify-end">
      <div className="relative size-full">
        <EstimateBarVisual
          absValue={absValue}
          percentage={percentage}
          isLose={isLose}
          isPositive={isPositive}
        />

        {allEstimates && allEstimates.length > 0 && (
          <Tooltip
            trigger={<div className="absolute inset-0 translate-y-1/2 " />}
            content={renderTooltipContent()}
            contentClasses="bg-neutral-800 text-white rounded max-w-[20rem] break-words border border-neutral-600 shadow-md"
            side="left"
          />
        )}
      </div>
    </div>
  );
};

export default EventEstimateBar;
