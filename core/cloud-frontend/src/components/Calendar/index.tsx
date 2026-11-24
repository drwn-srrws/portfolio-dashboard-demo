import * as React from "react";
import { DayPicker } from "react-day-picker";
import { addYears, endOfYear, startOfYear } from "date-fns";

import "react-day-picker/style.css";

import { cn } from "@/utils/utils";
import { Icon } from "../Icon/Icon";
import { buttonVariants } from "../ui/button";
import { YearsDropdown } from "./components/YearsDropdown";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) => {
  const startMonth = startOfYear(new Date("1970-01-01"));
  const endMonth = addYears(endOfYear(new Date()), 10);

  return (
    <DayPicker
      captionLayout="dropdown-years"
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      startMonth={startMonth}
      endMonth={endMonth}
      classNames={{
        months: "flex flex-col gap-4 sm:flex-row space-y-4 sm:space-y-0",
        month: "space-y-4",
        month_caption: "flex justify-center pt-2 relative items-center text-sm",
        caption_label: "text-sm font-medium",
        nav: "absolute left-0 top-0 w-full h-full space-x-1 flex items-center",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-3 top-[12px] z-[1]"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-3 top-[12px] z-[1]"
        ),
        chevron: "w-3 h-3",
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md hover:bg-accent rounded-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day_button: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
        range_start: "day-range-start",
        range_end: "day-range-end",
        selected:
          "bg-primary rounded-md text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "rounded-none aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <Icon name="ChevronLeft" color="currentColor" size="lg" />;
          } else if (orientation === "right") {
            return <Icon name="ChevronRight" color="currentColor" size="lg" />;
          }
          return <Icon name="ChevronDown" color="currentColor" size="lg" />;
        },
        YearsDropdown: (props) => {
          const result = YearsDropdown(props);
          return result || <></>;
        },
      }}
      data-id="calendar/root"
      {...props}
    />
  );
};
