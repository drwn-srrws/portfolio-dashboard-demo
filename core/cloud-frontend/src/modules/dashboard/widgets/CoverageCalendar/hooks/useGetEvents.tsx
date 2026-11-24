import { useMemo } from "react";
import { useGetEventMetrics } from "@api/endpoints/event/event";
import { Metric } from "@api/types";
import { hyphenatedDate } from "@/utils";
import { EventDto } from "../types/EventDto";

const metrics: Metric[] = [
  { name: "_event_id" },
  { name: "event_name" },
  { name: "date" },
];

export interface UseGetEventsOptions {
  startDate: Date;
  endDate: Date;
}

export const getEventsQueryKey = (startDate?: Date, endDate?: Date) => [
  "get-events",
  ...(startDate ? [hyphenatedDate(startDate)] : []),
  ...(endDate ? [hyphenatedDate(endDate)] : []),
];

export const useGetEvents = ({ startDate, endDate }: UseGetEventsOptions) => {
  const { data: responses, ...queryState } = useGetEventMetrics(
    [
      {
        metrics,
        start_date: hyphenatedDate(startDate),
        end_date: hyphenatedDate(endDate),
      },
    ],
    {},
    {
      query: {
        queryKey: getEventsQueryKey(startDate, endDate),
      },
    }
  );

  const response = responses?.[0];

  const events = useMemo(() => {
    return response?.data?.map((event) => ({
      id: event._event_id,
      date: event.date,
      name: event.event_name,
    })) as EventDto[];
  }, [response?.data]);

  return { data: events, ...queryState };
};
