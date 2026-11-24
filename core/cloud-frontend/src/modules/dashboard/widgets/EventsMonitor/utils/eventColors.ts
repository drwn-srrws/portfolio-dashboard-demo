import { EventEstimateProbability } from "@/api/types";

export const getEventStyleClasses = (
  probability?: EventEstimateProbability | null
): string => {
  const EventProbabilityBorderColorsMap = {
    [EventEstimateProbability.BAND_0_25]: "border-2 border-red-700",
    [EventEstimateProbability.BAND_25_50]: "border-2 border-red-300",
    [EventEstimateProbability.BAND_50_75]: "border-2 border-green-200",
    [EventEstimateProbability.BAND_75_100]: "border-2 border-green-500",
  } as const;

  const borderColorClass =
    probability && probability in EventProbabilityBorderColorsMap
      ? EventProbabilityBorderColorsMap[probability]
      : "border border-neutral-600";

  return [
    "rounded-full",
    "text-foreground",
    "px-2",
    "py-0",
    "h-8",
    borderColorClass,
  ]
    .filter(Boolean)
    .join(" ");
};
