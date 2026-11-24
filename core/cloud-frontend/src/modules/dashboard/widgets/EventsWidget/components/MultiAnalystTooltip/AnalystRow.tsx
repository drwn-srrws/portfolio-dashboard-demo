import { format } from "date-fns";
import { ReactNode } from "react";

import { Avatar } from "@components/Avatar";
import { parseDateString } from "@/utils";

import { EstimateItem, parseAnalystAvatar } from "./utils";

interface AnalystRowProps {
  estimate: EstimateItem;
  renderEventEstimateField: (estimate: EstimateItem) => ReactNode;
}

export const AnalystRow = ({
  estimate,
  renderEventEstimateField,
}: AnalystRowProps) => {
  const user = parseAnalystAvatar(estimate.analyst_avatar);
  const fullName = `${user.first_name} ${user.last_name}`.trim() || "Unknown";

  const updatedDate = estimate.event_estimate_last_updated_date
    ? parseDateString(estimate.event_estimate_last_updated_date)
    : null;
  const updatedLabel = updatedDate ? format(updatedDate, "MMM d") : null;

  return (
    <div className="flex items-start gap-3 px-3 py-2 hover:bg-neutral-700/50 transition-colors">
      <div className="flex-shrink-0 mt-0.5">
        <Avatar dense data={user} disableTooltip />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white truncate">
            {fullName}
          </span>
          {estimate.is_primary_analyst && (
            <span className="text-[10px] uppercase tracking-wide text-neutral-400 border border-neutral-600 rounded px-1">
              primary
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-300">
          <span className="font-semibold text-white">
            {renderEventEstimateField(estimate)}
          </span>
          {updatedLabel && (
            <>
              <span className="text-neutral-500" aria-hidden="true">
                •
              </span>
              <span className="text-neutral-400">Updated {updatedLabel}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
