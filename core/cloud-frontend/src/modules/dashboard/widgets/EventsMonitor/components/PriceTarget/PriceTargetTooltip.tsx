import { Avatar } from "@/components/Avatar";
import { numToDollar } from "@/utils";
import { formatDate } from "date-fns";
import { cellColor } from "@utils/ag-grid/cells";
import { PriceTargetData, PriceTargetType } from "../../types/PriceTargetTypes";

interface PriceTargetTooltipProps {
  type: PriceTargetType;
  allTargets?: PriceTargetData[];
}

export const PriceTargetTooltip = ({
  type,
  allTargets,
}: PriceTargetTooltipProps) => {
  const color =
    type === "upside" ? cellColor["positive"] : cellColor["negative"];

  const targets = allTargets || [];

  if (targets.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 p-2 text-white">
      <div className="text-sm font-medium text-white mb-1">
        {type === "upside" ? "Upside" : "Downside"} Price Targets
      </div>
      {targets.map((target) => (
        <div
          key={target.id}
          className="flex items-center gap-2 text-xs text-white"
        >
          <Avatar dense data={target.created_by} />
          <div className="flex-1">
            <div className="text-white">
              PT:{" "}
              <span style={{ color }}>
                {numToDollar(target.price_target_usd)}
              </span>
            </div>
            <div className="text-neutral-400 text-xs">
              {target.created_by.first_name} {target.created_by.last_name} •{" "}
              {formatDate(new Date(target.created_at_utc), "MMM dd, yyyy")}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
