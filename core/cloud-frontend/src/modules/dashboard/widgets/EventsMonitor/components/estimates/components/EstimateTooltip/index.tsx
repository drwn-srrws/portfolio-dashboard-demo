import { memo, useMemo } from "react";
import { cellColor } from "@utils/ag-grid/cells";
import { EstimateType } from "../../../../types/EstimateTypes";
import { CompanyEventEstimateResponse } from "@/api/types";
import { EstimateItem } from "./EstimateItem";
import { ExtendedEventResponse } from "../../../EventsMonitorGrid/EventsMonitorDetailGrid";

interface EstimateTooltipProps {
  type: EstimateType;
  estimates: ExtendedEventResponse["estimates"];
  maxItems?: number;
  showRelativeTime?: boolean;
}

export const EstimateTooltip = memo(
  ({
    type,
    estimates,
    maxItems = 10,
    showRelativeTime = false,
  }: EstimateTooltipProps) => {
    const tooltipData = useMemo(() => {
      const isUpside = type === "implied_upside";

      return {
        color: isUpside ? cellColor["positive"] : cellColor["negative"],
        title: `${isUpside ? "Upside" : "Downside"} Estimates`,
        emptyMessage: `No ${isUpside ? "upside" : "downside"} estimates available.`,
        displayEstimates: estimates?.slice(0, maxItems) || [],
      };
    }, [type, estimates, maxItems]);

    const { color, title, emptyMessage, displayEstimates } = tooltipData;

    if (!estimates?.length) {
      return (
        <div
          className="p-4 text-neutral-400 text-sm text-center"
          role="status"
          aria-live="polite"
        >
          {emptyMessage}
        </div>
      );
    }

    const hasMoreItems = estimates.length > maxItems;

    return (
      <div
        className="flex flex-col text-white"
        role="region"
        aria-label={title}
      >
        <header className="px-3 py-2 border-b border-neutral-600">
          <h3 className="text-sm font-semibold text-white mb-0">
            {title}
            {estimates.length > 1 && (
              <span className="ml-2 text-xs font-normal text-neutral-400">
                ({estimates.length} total)
              </span>
            )}
          </h3>
        </header>

        <div
          className="max-h-[280px] overflow-y-auto overscroll-contain"
          role="list"
          aria-label={`${title} list`}
        >
          {displayEstimates.map(
            (estimate: CompanyEventEstimateResponse, index: number) => (
              <EstimateItem
                key={estimate.id || `estimate-${index}`}
                estimate={estimate}
                type={type}
                color={color}
                showRelativeTime={showRelativeTime}
              />
            )
          )}

          {hasMoreItems && (
            <div className="px-3 py-2 text-xs text-neutral-400 text-center border-t border-neutral-700">
              +{estimates.length - maxItems} more estimate
              {estimates.length - maxItems !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    );
  }
);

EstimateTooltip.displayName = "EstimateTooltip";
