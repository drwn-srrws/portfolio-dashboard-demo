import { Tooltip } from "@/components/Tooltip/Tooltip";
import { formatMetric } from "@/utils/metrics";
import { MetricDisplayType } from "@/api/types";
import { getBarOffsetPercent, ivolAsOfSuffix } from "@/utils/ivol";
import { cn } from "@/utils";

const DOT_GAP_PX = 65;

export interface IvolDotProps {
  value: number | null | undefined;
  direction: "upside" | "downside";
  asOfDt?: string | null;
  /**
   * When set, positions the dot 15px past where a bar of this coefficient would end for
   * `value` (i.e. iVol's own magnitude, on the same scale as the analyst bar), instead
   * of static placement. Render inside the same relative container as the bar's fill.
   */
  barCoefficient?: number;
}

export const IvolDot = ({
  value,
  direction,
  asOfDt,
  barCoefficient,
}: IvolDotProps) => {
  if (value === null || value === undefined) return null;

  const isMismatched = direction === "upside" ? value <= 0 : value >= 0;

  const dot = (
    <Tooltip
      trigger={
        <span className="inline-flex size-3 items-center justify-center rounded-full ring-1 ring-blue-500">
          <span
            className={cn(
              "size-2 rounded-full bg-blue-500",
              isMismatched && "bg-stripes bg-stripes-blue-950"
            )}
          />
        </span>
      }
      content={`iVol ${direction === "upside" ? "Up" : "Down"}: ${formatMetric(
        value,
        MetricDisplayType.percent
      )}${ivolAsOfSuffix(asOfDt)}`}
      contentClasses="bg-neutral-800 text-white rounded max-w-[20rem] break-words border border-neutral-600 shadow-md p-2"
    />
  );

  if (barCoefficient == null) return dot;

  const offsetPercent = getBarOffsetPercent(value, barCoefficient);

  return (
    <span
      className="absolute z-10 -translate-y-1/2"
      style={{
        top: "calc(50% + 9px)",
        [direction === "upside" ? "left" : "right"]:
          `calc(${offsetPercent}% + ${DOT_GAP_PX}px)`,
      }}
    >
      {dot}
    </span>
  );
};
