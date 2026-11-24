import { StoplightSignal } from "@/api/types";
import { Tooltip } from "@/components/Tooltip/Tooltip";
import { cn } from "@/utils";
import { ivolAsOfSuffix } from "@/utils/ivol";

const stateColor: Record<string, string> = {
  GREEN: "bg-green-500",
  RED: "bg-red-500",
};

export interface StoplightProps {
  signals: StoplightSignal[];
  asOfDt?: string | null;
  className?: string;
}

export const Stoplight = ({ signals, asOfDt, className }: StoplightProps) => (
  <div className={cn("flex items-center gap-2", className)}>
    {signals.map((signal) => (
      <Tooltip
        key={signal.name}
        trigger={
          <span
            className={cn(
              "inline-block size-4 rounded-full",
              signal.state ? stateColor[signal.state] : "bg-neutral-500"
            )}
          />
        }
        content={`${signal.explanation}${ivolAsOfSuffix(asOfDt)}`}
        contentClasses="bg-neutral-800 text-white rounded max-w-[24rem] break-words border border-neutral-600 shadow-md p-3 text-sm leading-snug"
      />
    ))}
  </div>
);
