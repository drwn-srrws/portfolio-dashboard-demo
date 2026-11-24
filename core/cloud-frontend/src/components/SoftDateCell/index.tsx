import { Tooltip } from "@/components/Tooltip/Tooltip";
import { classifyEventHorizon, EventHorizonFields } from "@/utils/eventHorizon";

export interface SoftDateCellProps {
  formatted: string;
  horizon?: EventHorizonFields | null;
}

export const SoftDateCell = ({ formatted, horizon }: SoftDateCellProps) => {
  if (!horizon) return formatted;

  const classification = classifyEventHorizon(horizon);
  if (!classification.isSoft) return formatted;

  return (
    <Tooltip
      asChild
      trigger={<span className="cursor-help">{formatted}*</span>}
      content={classification.tooltip}
      contentClasses="max-w-xs"
    />
  );
};
