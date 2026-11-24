import { ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import { EventWrapperProps } from "react-big-calendar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui";
import { CalendarEvent } from "../../types/CalendarEvent";
import { CoverageEventPreview } from "../CoverageEventPreview";

export interface CoverageEventWrapperProps
  extends EventWrapperProps<CalendarEvent> {
  children?: ReactNode;
}

export const CoverageEventWrapper = ({
  children,
  event,
}: CoverageEventWrapperProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return (
    <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      {createPortal(
        <TooltipContent className="bg-transparent">
          <CoverageEventPreview
            event={event}
            onClose={() => setIsTooltipOpen(false)}
          />
        </TooltipContent>,
        document.body
      )}
    </Tooltip>
  );
};
