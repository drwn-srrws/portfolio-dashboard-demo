import { ReactNode, useMemo } from "react";
import { useTooltipContext } from "../context/TooltipContext";
import { useCrosshairContext } from "../context/CrosshairContext";
import { cn } from "@/utils";

export interface TooltipPlacement {
  vertical: "top" | "bottom" | "center";
  horizontal: "left" | "right" | "center";
}

export interface TooltipContentProps {
  placement?: TooltipPlacement;
  children?: ReactNode;
}

export const TooltipContent = ({
  children,
  placement = { vertical: "bottom", horizontal: "right" },
}: TooltipContentProps) => {
  const { seriesRefs } = useTooltipContext();
  const { closestPoint, closestSeries } = useCrosshairContext();

  const seriesApis = useMemo(
    () => seriesRefs.map((ref) => ref.api),
    [seriesRefs]
  );

  if (!closestPoint || !closestSeries || !seriesApis.includes(closestSeries))
    return null;

  return (
    <div
      className={cn(
        "flex flex-col absolute z-10 pointer-events-none",
        placement.vertical === "top" && "translate-y-[-100%]",
        placement.vertical === "center" && "translate-y-[-50%]",
        placement.horizontal === "left" && "translate-x-[-100%]",
        placement.horizontal === "center" && "translate-x-[-50%]"
      )}
      style={{
        left: closestPoint.x,
        top: closestPoint.y,
      }}
    >
      {children}
    </div>
  );
};
