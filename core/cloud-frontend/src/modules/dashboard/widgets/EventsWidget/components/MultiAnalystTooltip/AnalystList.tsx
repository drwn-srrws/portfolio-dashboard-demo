import { ReactNode, useMemo } from "react";

import { AnalystRow } from "./AnalystRow";
import { EstimateItem } from "./utils";

interface AnalystListProps {
  title: string;
  estimates: EstimateItem[];
  renderEventEstimateField: (estimate: EstimateItem) => ReactNode;
  maxItems?: number;
}

export const AnalystList = ({
  title,
  estimates,
  renderEventEstimateField,
  maxItems = 10,
}: AnalystListProps) => {
  const sorted = useMemo(() => {
    return [...estimates].sort((a, b) => {
      if (a.is_primary_analyst === b.is_primary_analyst) return 0;
      return a.is_primary_analyst ? -1 : 1;
    });
  }, [estimates]);

  const display = sorted.slice(0, maxItems);
  const overflow = sorted.length - display.length;

  return (
    <div className="flex flex-col text-white">
      <header className="px-3 py-2 border-b border-neutral-600">
        <h3 className="text-sm font-semibold text-white">
          {title}
          <span className="ml-2 text-xs font-normal text-neutral-400">
            ({estimates.length} total)
          </span>
        </h3>
      </header>
      <div
        className="max-h-[280px] overflow-y-auto overscroll-contain"
        role="list"
      >
        {display.map((estimate, index) => (
          <AnalystRow
            key={estimate.event_estimate_id ?? `estimate-${index}`}
            estimate={estimate}
            renderEventEstimateField={renderEventEstimateField}
          />
        ))}
        {overflow > 0 && (
          <div className="px-3 py-2 text-xs text-neutral-400 text-center border-t border-neutral-700">
            +{overflow} more estimate{overflow === 1 ? "" : "s"}
          </div>
        )}
      </div>
    </div>
  );
};
