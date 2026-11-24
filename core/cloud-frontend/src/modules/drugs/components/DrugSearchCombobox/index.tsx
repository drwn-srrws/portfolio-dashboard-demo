import { Search } from "lucide-react";
import {
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useDrugsSearch } from "@api/endpoints/drugs/drugs";
import { Input, InputAdornment } from "@components/ui/input";
import { cn, debounce } from "@/utils/utils";

const MIN_QUERY_LENGTH = 2;

export interface DrugSearchComboboxProps {
  value?: string;
  onSelect: (drugName: string) => void;
  className?: string;
  large?: boolean;
}

export const DrugSearchCombobox = ({
  value,
  onSelect,
  className,
  large = false,
}: DrugSearchComboboxProps) => {
  const [input, setInput] = useState(value ?? "");
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    setInput(value ?? "");
    return () => {
      if (blurTimeout.current) clearTimeout(blurTimeout.current);
    };
  }, [value]);

  const debouncedSetQuery = useMemo(() => debounce(setQuery, 300), []);

  const handleInputChange = (next: string) => {
    setInput(next);
    setFocused(true);
    debouncedSetQuery(next.trim());
  };

  const showList = focused && query.length >= MIN_QUERY_LENGTH;

  const { data, isFetching } = useDrugsSearch(
    { q: query, limit: 20 },
    { query: { enabled: showList } }
  );

  const results = data?.results ?? [];

  const handleSelect = (drugName: string) => {
    if (blurTimeout.current) clearTimeout(blurTimeout.current);
    setFocused(false);
    setInput(drugName);
    setQuery("");
    onSelect(drugName);
  };

  const handleFocus = () => {
    if (blurTimeout.current) clearTimeout(blurTimeout.current);
    setFocused(true);
    setInput("");
    setQuery("");
  };

  const handleBlur = () => {
    blurTimeout.current = setTimeout(() => {
      setFocused(false);
      setQuery("");
      setInput(value ?? "");
    }, 150);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && results.length > 0) {
      event.preventDefault();
      handleSelect(results[0]);
    } else if (event.key === "Escape") {
      setInput(value ?? "");
      setQuery("");
      event.currentTarget.blur();
    }
  };

  return (
    <div className={cn("relative", large ? "w-full" : "w-64", className)}>
      <Input
        value={input}
        onChange={(event) => handleInputChange(event.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Search a drug…"
        autoComplete="off"
        className={cn(
          "focus-within:ring-0",
          large && "h-14 rounded-full px-6 text-lg shadow-md"
        )}
        startAdornment={
          <InputAdornment variant="transparent">
            <Search className={cn("opacity-50", large ? "size-5" : "size-4")} />
          </InputAdornment>
        }
        data-testid="drug-search-input"
      />

      {showList && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-input bg-popover text-popover-foreground shadow-md">
          <ul className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
            {isFetching && results.length === 0 ? (
              <li className="px-2 py-2 text-sm text-muted-foreground">
                Searching…
              </li>
            ) : results.length === 0 ? (
              <li className="px-2 py-2 text-sm text-muted-foreground">
                No drugs found.
              </li>
            ) : (
              results.map((drugName) => (
                <li key={drugName}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(drugName)}
                    className="flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm capitalize hover:bg-accent hover:text-accent-foreground"
                  >
                    {drugName}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
