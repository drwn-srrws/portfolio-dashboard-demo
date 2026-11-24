import { formatDate } from "date-fns";
import { numToDollar } from "@/utils";
import { cellColor } from "@utils/ag-grid/cells";
import { CompanyResponsePrimaryAnalystUpsidePriceTarget as PriceTarget } from "@api/types";
import { PriceTargetType } from "../PriceTargetDropdown";

const priceTargetCellTypeColor: Record<PriceTargetType, string> = {
  upside: cellColor["positive"],
  downside: cellColor["negative"],
};

export interface PriceTargetHintProps {
  type: PriceTargetType;
  data: PriceTarget;
}

export const PriceTargetHint = ({ type, data }: PriceTargetHintProps) => (
  <div className="m-0 flex flex-col gap-2 rounded-md p-[3px] text-white">
    <div className="text-sm">
      Upside PT:
      {data?.price_target_usd ? (
        <span style={{ color: priceTargetCellTypeColor[type] }}>
          {" "}
          {numToDollar(data?.price_target_usd || 0)}
        </span>
      ) : (
        "N/A"
      )}
    </div>

    <div className="flex justify-between text-xs text-neutral-400">
      <span className="mr-4">
        Modified by {data?.created_by.first_name} {data?.created_by.last_name}
      </span>
      <span>
        Modified on{" "}
        {data?.created_at_utc &&
          formatDate(new Date(data?.created_at_utc || ""), "MMM dd, yyyy")}
      </span>
    </div>
  </div>
);
