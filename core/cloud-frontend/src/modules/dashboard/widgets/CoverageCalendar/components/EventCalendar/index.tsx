import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./EventCalendar.module.css";

import { ReactNode, useCallback, useMemo, useState } from "react";
import {
  Calendar,
  CalendarProps,
  dateFnsLocalizer,
  Event,
  View,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay, add, sub } from "date-fns";
import { enUS } from "date-fns/locale";
import { Icon } from "@components/Icon/Icon";

import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export interface EventCalendarProps<T extends Event>
  extends Omit<
    CalendarProps<T>,
    | "events"
    | "localizer"
    | "toolbar"
    | "date"
    | "onSelectEvent"
    | "onView"
    | "onNavigate"
  > {
  data?: T[];
  view?: View;
  date?: Date;
  loading?: boolean;
  rightSlot?: ReactNode;
  onViewChange?: (view: View) => void;
  onSelectEvent?: (event: T) => void;
  onDateChange?: (date: Date) => void;
}

export const EventCalendar = <T extends Event>({
  rightSlot,
  data,
  loading,
  defaultView = "month",
  defaultDate = new Date(),
  view: propView,
  date: propDate,
  onSelectEvent,
  onDateChange,
  onViewChange,
  ...props
}: EventCalendarProps<T>) => {
  const [_date, _setDate] = useState(defaultDate);
  const [_view, _setView] = useState<View>(defaultView);

  const date = propDate ?? _date;
  const view = propView ?? _view;

  const setDate = useCallback(
    (date: Date) => {
      if (!propDate) _setDate(date);
      onDateChange?.(date);
    },
    [_setDate, onDateChange, propDate]
  );

  const setView = useCallback(
    (view: View) => {
      if (!propView) _setView(view);
      onViewChange?.(view);
    },
    [_setView, onViewChange, propView]
  );

  const handleNextMonth = useCallback(() => {
    setDate(add(date, { months: 1 }));
  }, [date, setDate]);

  const handleLastMonth = useCallback(() => {
    setDate(sub(date, { months: 1 }));
  }, [date, setDate]);

  const handleView = useCallback(
    (view: View) => {
      if (!propView) setView(view);
      onViewChange?.(view);
    },
    [setView, onViewChange, propView]
  );

  const handleNavigate = useCallback(
    (date: Date) => {
      if (!propDate) setDate(date);
      onDateChange?.(date);
    },
    [setDate, onDateChange, propDate]
  );

  const dateText = useMemo(() => {
    return format(date, "MMMM yyyy");
  }, [date]);

  return (
    <div className="size-full flex flex-col">
      <div className="flex justify-between items-center pb-2">
        <div className="flex gap-2 items-center ">
          <p className="text-base font-semibold w-[90px]">{dateText}</p>
          <Button variant={"outline"} className="p-2" onClick={handleLastMonth}>
            <Icon name="ChevronLeft" size="lg" color="currentColor" />
          </Button>
          <Button
            variant={"outline"}
            onClick={() => {
              setDate(new Date());
            }}
          >
            Today
          </Button>
          <Button variant={"outline"} className="p-2" onClick={handleNextMonth}>
            <Icon name="ChevronRight" size="lg" color="currentColor" />
          </Button>
        </div>
        {rightSlot}
      </div>

      {!loading ? (
        <Calendar
          {...props}
          events={data}
          localizer={localizer}
          toolbar={false}
          date={date}
          view={view}
          className={styles.wrapper}
          onView={handleView}
          onNavigate={handleNavigate}
          onSelectEvent={onSelectEvent}
        />
      ) : (
        <Skeleton className="size-full" />
      )}
    </div>
  );
};
