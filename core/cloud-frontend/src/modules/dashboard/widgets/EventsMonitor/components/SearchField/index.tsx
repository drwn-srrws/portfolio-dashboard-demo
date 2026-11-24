import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchFieldProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  testId?: string;
  placeholder?: string;
}

export const SearchField = ({
  value,
  onChange,
  testId,
  placeholder = "Search companies...",
}: SearchFieldProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        data-testid={testId}
        className="pl-10 w-64"
      />
    </div>
  );
};
