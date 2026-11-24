import { ChangeEvent, useCallback } from "react";

import { TextField, TextFieldProps } from "../TextField";
import { InputAdornment } from "../ui";

const LINK_REGEX = /^https?:\/\//;

export interface LinkFieldProps
  extends Omit<TextFieldProps, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

export const LinkField = ({ value, onChange, ...props }: LinkFieldProps) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const baseUrl = value.trim().replace(LINK_REGEX, "");
      onChange(baseUrl ? `https://${baseUrl}` : "");
    },
    [onChange]
  );

  return (
    <TextField
      {...props}
      value={value.replace(LINK_REGEX, "")}
      startAdornment={
        <InputAdornment variant="contained">
          <span>https://</span>
        </InputAdornment>
      }
      onChange={handleChange}
    />
  );
};
