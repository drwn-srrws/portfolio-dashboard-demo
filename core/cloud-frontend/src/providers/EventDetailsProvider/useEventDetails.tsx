import { useContext } from "react";
import { EventDetailsContext } from "./EventDetailsContext";

export const useEventDetails = () => {
  const context = useContext(EventDetailsContext);

  if (!context) {
    throw new Error(
      "useEventDetails must be used within an EventDetailsProvider"
    );
  }

  return context;
};
