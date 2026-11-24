import { truncate } from "@/utils/strings";
import { cn } from "@/utils/utils";
import { Tooltip } from "@/components/Tooltip/Tooltip";

export type ITradingTickerCard = {
  displayName: string;
  value: React.ReactNode | null;
  lastValue?: React.ReactNode;
};

export const TradingTickerCard = ({
  displayName,
  value,
  lastValue,
}: ITradingTickerCard) => (
  <div
    className={cn(
      "flex flex-col border-2 w-auto rounded-3xl p-4 gap-2 items-center justify-between min-w-[155px] border-neutral-800 max-h-[98%]"
    )}
  >
    <h6 className="text-base font-medium text-neutral-400">
      <Tooltip
        trigger={<span>{truncate(displayName, 25)}</span>}
        content={<p className="text-black">{displayName}</p>}
      />
    </h6>
    <div className="flex items-center gap-6">
      <h3 className={cn("text-xl")}>{value || lastValue}</h3>
    </div>
  </div>
);
