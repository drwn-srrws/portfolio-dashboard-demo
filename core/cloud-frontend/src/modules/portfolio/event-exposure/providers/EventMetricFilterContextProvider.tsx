import { ReactNode, useCallback, useState } from "react";
import {
  IEventMetricFilters,
  initialValues,
  EventMetricFilters,
} from "./EventMetricFilterContext";

export interface EventMetricFilterContextProviderProps {
  children: ReactNode;
  defaultEventMetricFilters?: IEventMetricFilters;
}

export const EventMetricFilterContextProvider = ({
  children,
  defaultEventMetricFilters,
}: EventMetricFilterContextProviderProps) => {
  const [eventMetricFilters, setEventMetricFilters] =
    useState<IEventMetricFilters>(
      defaultEventMetricFilters || initialValues.eventMetricFilters
    );

  const reset = useCallback(() => {
    setEventMetricFilters(
      defaultEventMetricFilters ?? initialValues.eventMetricFilters
    );
  }, [defaultEventMetricFilters]);

  const value = {
    reset,
    eventMetricFilters,
    setEventMetricFilters,
  };

  return (
    <EventMetricFilters.Provider value={value}>
      {children}
    </EventMetricFilters.Provider>
  );
};
