import React from "react";
import { formatCurrency } from "./utils";
import { Avatar } from "@/components/Avatar";
import { CompanyEventEstimateResponse, MetricDisplayType } from "@/api/types";
import { formatMetric } from "@/utils/metrics";

interface EstimateTooltipContentProps {
  allEstimates: CompanyEventEstimateResponse[];
  isUpside: boolean;
}

const EstimateTooltipContent: React.FC<EstimateTooltipContentProps> = ({
  allEstimates,
  isUpside,
}) => {
  if (!allEstimates || allEstimates.length === 0) {
    return null;
  }

  return (
    <div className="text-sm space-y-3">
      <div className="font-semibold text-white">
        {isUpside ? "Upside" : "Downside"} Estimates
      </div>
      {allEstimates.map((estimate, index) => {
        const percentage = isUpside
          ? estimate.latest_upside_percentage
          : estimate.latest_downside_percentage;
        const impliedPrice = isUpside
          ? estimate.implied_upside_price_usd
          : estimate.implied_downside_price_usd;
        const note = isUpside ? estimate.upside_notes : estimate.downside_notes;

        return (
          <div key={estimate.id || index} className="flex gap-2 items-start">
            {estimate.created_by && <Avatar data={estimate.created_by} />}
            <div className="flex-1 space-y-1">
              <div className="font-medium text-white">
                {estimate.created_by
                  ? `${estimate.created_by.first_name} ${estimate.created_by.last_name}`
                  : "Unknown"}
              </div>
              {percentage != null && (
                <div className="text-white">
                  Estimate:{" "}
                  <span className="font-medium">
                    {formatMetric(percentage, MetricDisplayType.percent)}
                  </span>
                </div>
              )}
              {impliedPrice != null && (
                <div className="text-white">
                  {isUpside ? "Implied Upside" : "Implied Downside"}:{" "}
                  <span className="font-medium">
                    {formatCurrency(impliedPrice)}
                  </span>
                </div>
              )}
              {note && <div className="text-neutral-300 text-xs">{note}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EstimateTooltipContent;
