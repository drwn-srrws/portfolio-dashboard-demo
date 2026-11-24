import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { Icon } from "@/components/Icon/Icon";
import { cn } from "@/utils/utils";

import { Button } from "../ui/button";
import { Calendar } from "../Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export interface DateRangeSinglePickerProps {
  className?: string;
  date?: DateRange;
  setDate?: (date: DateRange | undefined) => void;
}

export function DateRangeSinglePicker({
  className,
  date,
  setDate,
}: DateRangeSinglePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal gap-2",
              !date && "text-muted-foreground"
            )}
          >
            <Icon name="CalendarDays" color="currentColor" size="lg" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
