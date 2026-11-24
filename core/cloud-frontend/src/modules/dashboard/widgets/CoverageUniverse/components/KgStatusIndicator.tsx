import { KgStatus } from "@/api/types/kgStatus";
import { KgGraphIcon } from "@/components/icons/KgGraphIcon";
import { Tooltip } from "@/components/Tooltip/Tooltip";

const tooltipClasses =
  "z-[9999] max-w-[260px] rounded border border-neutral-600 bg-neutral-800 p-2 text-xs leading-4 text-neutral-300 shadow-md";

const KG_STATUS_CONFIG: Record<
  KgStatus,
  { className: string; tooltip: string; testId: string }
> = {
  [KgStatus.FRESH]: {
    className: "text-green-500",
    tooltip:
      "Knowledge Graph data is available and up to date for this company.",
    testId: "kg-status-fresh",
  },
  [KgStatus.STALE]: {
    className: "text-amber-400",
    tooltip:
      "Knowledge Graph data is available but may be out of date and should be refreshed.",
    testId: "kg-status-stale",
  },
  [KgStatus.NOT_PRESENT]: {
    className: "text-red-500",
    tooltip: "Knowledge Graph data is not available for this company.",
    testId: "kg-status-not-present",
  },
};

export interface KgStatusIndicatorProps {
  status: KgStatus;
}

export const KgStatusIndicator = ({ status }: KgStatusIndicatorProps) => {
  const config = KG_STATUS_CONFIG[status];

  return (
    <Tooltip
      trigger={
        <span
          className="inline-flex items-center justify-center"
          data-testid={config.testId}
          aria-label={config.tooltip}
        >
          <KgGraphIcon size={18} className={config.className} />
        </span>
      }
      content={config.tooltip}
      contentClasses={tooltipClasses}
      asChild
    />
  );
};
