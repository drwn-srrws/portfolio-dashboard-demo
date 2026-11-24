import { ComponentProps, ReactNode, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui";

import { AnalystList } from "./AnalystList";
import { EstimateItem } from "./utils";

export interface MultiAnalystTooltipProps {
  estimates: EstimateItem[];
  title: string;
  renderEventEstimateField: (estimate: EstimateItem) => ReactNode;
  side?: ComponentProps<typeof TooltipContent>["side"];
  children: ReactNode;
}

export const MultiAnalystTooltip = ({
  estimates,
  title,
  renderEventEstimateField,
  side = "right",
  children,
}: MultiAnalystTooltipProps) => {
  const [open, setOpen] = useState(false);

  if (estimates.length === 0) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <div className="cursor-default">{children}</div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            side={side}
            className="z-50 backdrop-blur-md shadow-2xl rounded-xl bg-neutral-800 border border-neutral-600 max-w-[320px] p-0"
          >
            <AnalystList
              title={title}
              estimates={estimates}
              renderEventEstimateField={renderEventEstimateField}
            />
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
};
