import { createContext, SetStateAction, Dispatch, useContext } from "react";

export type IEventMetricFilters = Partial<
  Record<"enable_low_impact_filter", boolean>
>;

export type EventMetricFilterContextType = {
  reset: () => void;
  eventMetricFilters: IEventMetricFilters;
  setEventMetricFilters: Dispatch<SetStateAction<IEventMetricFilters>>;
};

export const initialValues: EventMetricFilterContextType = {
  reset: () => {},
  eventMetricFilters: {},
  setEventMetricFilters: () => {},
};

export const EventMetricFilters =
  createContext<EventMetricFilterContextType>(initialValues);

export const useEventMetricFilter = () => {
  const context = useContext(EventMetricFilters);

  if (!context) {
    throw new Error(
      "useEventMetricFilter must be used within a EventMetricFilters"
    );
  }

  return context;
};
