import { Components } from "react-big-calendar";
import { useCallback, useMemo, useState } from "react";
import { add, endOfMonth, startOfMonth } from "date-fns";

import { useStore } from "@/store";
import { Dialogs } from "@store/slices/dialogsSlice";

import { CoverageEvent } from "../CoverageEvent";
import { CalendarEvent } from "../../types/CalendarEvent";
import { useGetEvents } from "../../hooks/useGetEvents";
import { parseDateString } from "@/utils";
import { EventCalendar } from "../EventCalendar";

const components: Components<CalendarEvent> = {
  event: CoverageEvent,
};

const VIEW = "month";

export const CoverageCalendar = () => {
  const { updateDialog } = useStore();

  const [date, setDate] = useState(startOfMonth(new Date()));

  const { data: events, isLoading } = useGetEvents({
    startDate: startOfMonth(date),
    endDate: endOfMonth(date),
  });

  const handleEditEvent = useCallback(
    (event: CalendarEvent) => {
      updateDialog({
        dialog: Dialogs.eventDialog,
        status: true,
        prefilled: event,
      });
    },
    [updateDialog]
  );

  const handleDateChange = useCallback((date: Date) => {
    setDate(startOfMonth(date));
  }, []);

  const data = useMemo(() => {
    return events?.map((event) => ({
      id: `${event.id}`,
      name: event.name,
      start: parseDateString(event.date),
      end: add(parseDateString(event.date) || new Date(), { hours: 1 }),
    })) as CalendarEvent[];
  }, [events]);

  return (
    <EventCalendar
      showAllEvents
      loading={isLoading}
      data={data}
      date={date}
      components={components}
      view={VIEW}
      onSelectEvent={handleEditEvent}
      onDateChange={handleDateChange}
    />
  );
};
