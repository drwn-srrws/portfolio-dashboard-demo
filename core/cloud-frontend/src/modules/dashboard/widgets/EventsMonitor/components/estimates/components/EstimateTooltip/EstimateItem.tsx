import { memo, useMemo } from "react";
import { Avatar } from "@/components/Avatar";
import { formatDate } from "date-fns";
import { lastUpdated } from "@/utils/dates";
import { EstimateType } from "../../../../types/EstimateTypes";
import { CompanyEventEstimateResponse } from "@/api/types";

export interface EstimateItemProps {
  estimate: CompanyEventEstimateResponse;
  type: EstimateType;
  color: string;
  showRelativeTime: boolean;
}

export const EstimateItem = memo(
  ({ estimate, type, color, showRelativeTime }: EstimateItemProps) => {
    const percentageValue = useMemo(() => {
      const value =
        type === "implied_upside"
          ? estimate.upside_percentage
          : estimate.downside_percentage;
      return value != null ? value : "N/A";
    }, [estimate, type]);

    const authorName = useMemo(() => {
      if (!estimate.created_by) return "Unknown";
      const { first_name, last_name } = estimate.created_by;
      return `${first_name || ""} ${last_name || ""}`.trim() || "Unknown";
    }, [estimate.created_by]);

    const timeDisplay = useMemo(() => {
      if (!estimate.updated_at_utc) return "";

      const date = new Date(estimate.updated_at_utc);
      if (isNaN(date.getTime())) return "";

      return showRelativeTime
        ? lastUpdated(date)
        : formatDate(date, "MMM dd, yyyy");
    }, [estimate.updated_at_utc, showRelativeTime]);

    return (
      <div
        className="flex items-start gap-3 p-2 rounded-md hover:bg-neutral-700/50 transition-colors"
        role="listitem"
        aria-label={`${type === "implied_upside" ? "Upside" : "Downside"} estimate by ${authorName}`}
      >
        {estimate.created_by && (
          <div className="flex-shrink-0 mt-0.5">
            <Avatar dense data={estimate.created_by} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-neutral-300">PT:</span>
            <span
              className="text-sm font-semibold"
              style={{ color }}
              aria-label={`Price target ${percentageValue}`}
            >
              {typeof percentageValue === "number"
                ? percentageValue.toFixed(2)
                : percentageValue}
              %
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <span className="truncate" title={authorName}>
              {authorName}
            </span>
            {timeDisplay && (
              <>
                <span aria-hidden="true">•</span>
                <span title={timeDisplay} className="whitespace-nowrap">
                  {timeDisplay}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

EstimateItem.displayName = "EstimateItem";
