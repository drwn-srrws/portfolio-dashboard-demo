import { EventProps } from "react-big-calendar";
import { cn } from "@/utils";
import { CalendarEvent } from "../../types/CalendarEvent";

export type CoverageEventProps = EventProps<CalendarEvent>;

export const CoverageEvent = ({ event }: CoverageEventProps) => {
  return (
    <div
      data-testid={`coverage-event-${event.name}`}
      className={cn("pl-1 bg-blue-800 size-full")}
    >
      {event.name}
    </div>
  );
};
