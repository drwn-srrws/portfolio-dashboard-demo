import { TooltipPortal } from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

import {
  Tooltip as ShadTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";

export const Tooltip = ({
  trigger,
  content,
  side = "top",
  contentClasses = "",
  triggerClasses = "",
  asChild = false,
  dontShowInstantly = false,
}: {
  trigger: ReactNode;
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  contentClasses?: string;
  triggerClasses?: string;
  asChild?: boolean;
  dontShowInstantly?: boolean | number;
}) => (
  <TooltipProvider>
    <ShadTooltip
      delayDuration={
        dontShowInstantly
          ? typeof dontShowInstantly === "number"
            ? dontShowInstantly
            : 700
          : 0
      }
    >
      <TooltipTrigger className={triggerClasses} asChild={asChild}>
        {trigger}
      </TooltipTrigger>
      {content && (
        <TooltipPortal>
          <TooltipContent side={side} className={contentClasses}>
            {content}
          </TooltipContent>
        </TooltipPortal>
      )}
    </ShadTooltip>
  </TooltipProvider>
);
