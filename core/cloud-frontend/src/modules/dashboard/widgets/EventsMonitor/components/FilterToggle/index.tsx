interface FilterOption {
  value: string;
  label: string;
}

interface FilterToggleProps {
  value: string;
  onValueChange: (value: string) => void;
  options: FilterOption[];
  isMobile?: boolean;
}

export const FilterToggle = ({
  value,
  onValueChange,
  options,
  isMobile = false,
}: FilterToggleProps) => {
  return (
    <div className="flex items-center border border-border rounded-md overflow-hidden text-sm">
      {options.map((option, index) => (
        <button
          key={option.value}
          onClick={() => onValueChange(option.value)}
          className={`${isMobile ? "px-2 py-1 text-xs" : "px-3 py-1.5"} transition-colors ${
            index > 0 ? "border-l border-border" : ""
          } ${
            value === option.value
              ? "bg-primary text-primary-foreground font-medium"
              : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
