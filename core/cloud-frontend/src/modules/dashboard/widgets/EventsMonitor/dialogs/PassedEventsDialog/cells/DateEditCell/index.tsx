import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { CustomCellRendererProps } from "@ag-grid-community/react";

import { DatePicker } from "@/components/DatePicker";
import { PassedEvent } from "../../types/PassedEventsData";

interface DateEditCellProps
  extends CustomCellRendererProps<PassedEvent, string> {
  onDateChange?: (eventId: number, newDate: string) => void;
}

export const DateEditCell = (
  params: DateEditCellProps & {
    onDateChange?: (eventId: number, newDate: string) => void;
  }
) => {
  const { value, data, onDateChange } = params;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  const handleDateSelect = useCallback(
    (date?: Date) => {
      if (date && data && onDateChange) {
        const dateString = format(date, "yyyy-MM-dd");
        setSelectedDate(date);
        onDateChange(data.eventId, dateString);
      }
    },
    [data, onDateChange]
  );

  useEffect(() => {
    setSelectedDate(value ? new Date(value) : undefined);
  }, [value]);

  if (!data) return null;

  return (
    <div className="flex items-center h-full w-full">
      <DatePicker
        value={selectedDate}
        onChange={handleDateSelect}
        placeholder="Select date"
        className="h-full border-none bg-transparent p-0 shadow-none hover:bg-transparent focus:ring-0 underline [&>button]:border-none [&>button]:bg-transparent [&>button]:p-1 [&>button]:shadow-none [&>button]:hover:bg-transparent [&>button]:focus:ring-0 [&>button>svg:first-child]:hidden [&>button>button]:hidden"
      />
    </div>
  );
};
