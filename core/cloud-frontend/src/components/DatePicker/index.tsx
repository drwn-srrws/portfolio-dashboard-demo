import "./DatePicker.css";
import { format, isValid, parse, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { Button, Input } from "@components/ui";
import { Calendar } from "@/components/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { cn } from "@/utils/utils";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useKeyHandler, RecognizedKeys } from "@/hooks/useKeyHandler";
import { useDebounce } from "@/hooks/useDebounce";

interface CustomInputProps {
  "data-testid"?: string;
}

interface DatePickerProps {
  value?: Date | null;
  onChange?: (date?: Date) => void;
  className?: string;
  placeholder?: string;
  inputProps?: CustomInputProps;
  disabled?: boolean;
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  function DatePickerCmp(
    { value, onChange, className, placeholder, inputProps, disabled = false },
    ref
  ) {
    const [lastInputWasTyping, setLastInputWasTyping] = useState(false);
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState(
      value && isValid(value) ? value : new Date()
    );

    const [monthValue, setMonthValue] = useState("");
    const [dayValue, setDayValue] = useState("");
    const [yearValue, setYearValue] = useState("");

    const yearInputRef = useRef<HTMLInputElement>(null);
    const monthInputRef = useRef<HTMLInputElement>(null);
    const dayInputRef = useRef<HTMLInputElement>(null);

    const safeValue = useMemo(
      () => (value === null ? undefined : value),
      [value]
    );

    const closePopover = useCallback(() => {
      setOpen(false);
      setLastInputWasTyping(false);
    }, []);

    const toggleOpen = useCallback(() => {
      if (!disabled) {
        setOpen((prev) => !prev);
      }
    }, [disabled]);

    const handleCalendarSelect = useCallback(
      (date: Date | undefined) => {
        if (!lastInputWasTyping) {
          onChange?.(date);
          closePopover();
        }
        setLastInputWasTyping(false);
      },
      [lastInputWasTyping, onChange, closePopover]
    );

    const handleDebouncedChange = useCallback(() => {
      if (monthValue && dayValue && yearValue && yearValue.length === 4) {
        try {
          const dateString = `${yearValue}-${monthValue.padStart(2, "0")}-${dayValue.padStart(2, "0")}`;
          const parsed = parse(dateString, "yyyy-MM-dd", new Date());
          const result = startOfDay(parsed);

          const fullYear = result.getFullYear();
          const isAValidDate = isValid(result);

          const isSame =
            value &&
            result.getFullYear() === value.getFullYear() &&
            result.getMonth() === value.getMonth() &&
            result.getDate() === value.getDate();

          if (isAValidDate && fullYear >= 1970 && fullYear < 2100 && !isSame) {
            onChange?.(result);
            setMonth(result);
          }
        } catch (error) {
          console.error("Invalid date format:", error);
        }
      }
    }, [monthValue, dayValue, yearValue, value, onChange]);

    const debouncedOnChange = useDebounce(handleDebouncedChange, 500);

    const handleChange = useCallback(
      (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "month" | "day" | "year"
      ) => {
        const raw = e.target.value.replace(/\D/g, "");
        setLastInputWasTyping(true);

        if (type === "month") {
          if (parseInt(raw) > 12) return;
          setMonthValue(raw);
          if (raw.length === 2) dayInputRef.current?.focus();
        } else if (type === "day") {
          if (parseInt(raw) > 31) return;
          setDayValue(raw);
        } else if (type === "year") {
          setYearValue(raw);
          if (raw.length === 4) monthInputRef.current?.focus();
        }
      },
      []
    );

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.(undefined);
        setMonthValue("");
        setDayValue("");
        setYearValue("");
      },
      [onChange]
    );

    useKeyHandler(RecognizedKeys.ESC, () => {
      onChange?.(undefined);
      closePopover();
    });

    useKeyHandler(RecognizedKeys.ENTER, () => {
      onChange?.(safeValue);
      closePopover();
    });

    useEffect(() => {
      if (safeValue && isValid(safeValue)) {
        const newMonth = format(safeValue, "MM");
        const newDay = format(safeValue, "dd");
        const newYear = format(safeValue, "yyyy");

        if (
          newMonth !== monthValue ||
          newDay !== dayValue ||
          newYear !== yearValue
        ) {
          setMonthValue(newMonth);
          setDayValue(newDay);
          setYearValue(newYear);
        }
      } else if (!safeValue && (monthValue || dayValue || yearValue)) {
        setMonthValue("");
        setDayValue("");
        setYearValue("");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [safeValue]);

    useEffect(() => {
      debouncedOnChange();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthValue, dayValue, yearValue]);

    return (
      <Popover open={open} data-id="date-picker/popover">
        <PopoverTrigger asChild>
          <Button
            onClick={toggleOpen}
            variant={"outline"}
            data-id="date-picker/trigger"
            className={cn(
              "w-full justify-start text-left font-normal py-[1.2rem] relative",
              !safeValue && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            data-testid={inputProps?.["data-testid"]}
            disabled={disabled}
            aria-label={placeholder || "Pick a date"}
          >
            <CalendarIcon
              className="mr-2 h-4 w-4"
              data-id="date-picker/trigger/icon"
            />
            {safeValue ? (
              <>
                {format(safeValue, "PPP")}
                {!disabled && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 h-6 w-6 hover:bg-transparent"
                    onClick={handleClear}
                    data-id="date-picker/clear"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </>
            ) : (
              <span>{placeholder || "Pick a date"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          ref={ref}
          data-id="date-picker/content"
          onPointerDownOutside={closePopover}
        >
          <div className="py-2 pt-1 flex items-center justify-center gap-1">
            <Input
              id="year"
              data-testid="date-picker-year-input"
              type="text"
              value={yearValue}
              onChange={(e) => handleChange(e, "year")}
              placeholder="YYYY"
              maxLength={4}
              className="w-16"
              aria-label="Year"
              ref={yearInputRef}
            />
            <span className="text-muted-foreground">–</span>
            <Input
              id="month"
              data-testid="date-picker-month-input"
              type="text"
              value={monthValue}
              onChange={(e) => handleChange(e, "month")}
              placeholder="MM"
              maxLength={2}
              className="w-16"
              aria-label="Month"
              ref={monthInputRef}
            />
            <span className="text-muted-foreground">–</span>
            <Input
              id="day"
              data-testid="date-picker-day-input"
              type="text"
              value={dayValue}
              onChange={(e) => handleChange(e, "day")}
              placeholder="DD"
              maxLength={2}
              className="w-16"
              aria-label="Day"
              ref={dayInputRef}
            />
          </div>
          <Calendar
            data-id="date-picker/calendar"
            onMonthChange={setMonth}
            mode="single"
            selected={safeValue}
            onSelect={handleCalendarSelect}
            month={month}
            className="border-t"
          />
        </PopoverContent>
      </Popover>
    );
  }
);
