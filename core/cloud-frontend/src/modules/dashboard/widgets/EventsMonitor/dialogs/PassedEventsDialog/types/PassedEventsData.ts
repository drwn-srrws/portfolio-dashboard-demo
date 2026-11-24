export interface PassedEvent {
  eventId: number;
  companyName: string;
  eventName: string;
  eventDescription: string;
  eventDate: string;
  hasPassed: boolean;
}

export interface PassedEventsData {
  events: PassedEvent[];
}
