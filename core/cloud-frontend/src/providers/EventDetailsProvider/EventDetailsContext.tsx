import { createContext } from "react";
import { EventTrackerRowResponse, EventTrackerEvent } from "@api/types";

export interface EventDetails extends EventTrackerRowResponse {
  event: EventTrackerEvent;
}

export interface IEventDetailContext {
  eventId: number | null;
  setEventId: (event: number | null) => void;
}

export const EventDetailsContext = createContext<IEventDetailContext>(
  {} as IEventDetailContext
);
