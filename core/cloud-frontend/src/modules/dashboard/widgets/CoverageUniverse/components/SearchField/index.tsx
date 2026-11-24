import { Search } from "lucide-react";
import { TextField, TextFieldProps } from "@components/TextField";
import { InputAdornment } from "@components/ui";

export const SearchField = (props: TextFieldProps) => (
  <TextField
    {...props}
    placeholder="Search"
    startAdornment={
      <InputAdornment variant="transparent">
        <Search className="w-4 text-neutral-500" />
      </InputAdornment>
    }
  />
);
