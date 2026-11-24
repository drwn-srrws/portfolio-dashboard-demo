import { JSX, useState } from "react";
import { EventDetailsContext } from "./EventDetailsContext";

export const EventDetailsProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [eventId, setEventId] = useState<number | null>(null);
  const Provider = EventDetailsContext.Provider;

  return <Provider value={{ eventId, setEventId }}>{children}</Provider>;
};
