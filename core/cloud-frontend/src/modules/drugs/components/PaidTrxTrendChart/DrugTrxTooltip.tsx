import { format, parseISO } from "date-fns";
import type { Time } from "lightweight-charts";

import {
  TooltipContainer,
  TooltipTitle,
  useCrosshairContext,
} from "@components/Chart";

import { formatTrx } from "./PaidTrxTrendChart.utils";

const formatTime = (time: Time | undefined): string => {
  if (time == null) return "-";
  if (typeof time === "string") {
    try {
      return format(parseISO(time), "MMM d, yyyy");
    } catch {
      return time;
    }
  }
  if (typeof time === "object" && "year" in time) {
    return format(new Date(time.year, time.month - 1, time.day), "MMM d, yyyy");
  }
  return format(new Date(Number(time) * 1000), "MMM d, yyyy");
};

export interface DrugTrxTooltipProps {
  name: string;
  color: string;
}

export const DrugTrxTooltip = ({ name, color }: DrugTrxTooltipProps) => {
  const { closestPoint } = useCrosshairContext();

  if (!closestPoint) return null;

  return (
    <TooltipContainer>
      <TooltipTitle style={{ color }}>{name}</TooltipTitle>
      <span className="text-xs">
        <b>Date:</b> {formatTime(closestPoint.time)}
      </span>
      <span className="text-xs">
        <b>Paid TRx:</b> {formatTrx(closestPoint.value)}
      </span>
    </TooltipContainer>
  );
};
