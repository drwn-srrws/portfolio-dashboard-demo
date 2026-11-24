import { Event } from "react-big-calendar";

export interface CalendarEvent extends Event {
  id: string;
  name: string;
  start: Date;
  end: Date;
}
