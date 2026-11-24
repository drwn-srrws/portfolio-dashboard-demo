import { format } from "date-fns";
import { useController } from "react-hook-form";
import { useCallback, useEffect } from "react";
import {
  SecurityCodeAuditResponse,
  SecurityCodeDisplayAuditResponse,
} from "@/api/types";
import { FormControl } from "@/components/Form/FormControl";
import { HelperText } from "@/components/HelperText";
import { InfiniteAutocomplete } from "../InfiniteAutocomplete";
import useEffectEvent from "@/hooks/useEffectEvent";

export type AuditResponse =
  | SecurityCodeAuditResponse
  | SecurityCodeDisplayAuditResponse;

export type AuditFieldData = AuditResponse & {
  fallback: AuditResponse["value"];
};

export interface FormAuditFieldProps {
  name: string;
  options: { value: string; label: string }[];
  search: string;
  isLoadingMore: boolean;
  isLoadingOptions: boolean;
  disabled?: boolean;
  disableFiltering: boolean;
  onSearchChange: (value: string) => void;
  onLoadMore: () => void;
}

export const FormAuditField = ({
  name,
  options,
  onSearchChange,
  ...props
}: FormAuditFieldProps) => {
  const { field } = useController({ name });

  const audit = field.value as AuditFieldData;

  const handleChange = useCallback(
    (value: string) => {
      onSearchChange(value);
      const newValue: AuditResponse = { ...audit, value };
      field.onChange(newValue);
    },
    [audit, field, onSearchChange]
  );

  const date = audit.override
    ? format(audit.override.created_at_utc, "HH:mm yyyy-MM-dd")
    : null;

  const initSearchValue = useEffectEvent(() => {
    onSearchChange(audit.value ?? "");
  });

  // TODO: Ideally we should remove this useEffect, but it will require a huge refactor of how form fields are handled
  useEffect(() => {
    initSearchValue();
  }, [initSearchValue]);

  return (
    <FormControl>
      <InfiniteAutocomplete
        {...props}
        value={audit.value ?? ""}
        placeholder={audit.fallback ?? "None"}
        options={options}
        onChange={handleChange}
      />
      <HelperText>
        {audit.override
          ? `Updated at ${date} by ${audit.override.created_by.name}`
          : undefined}
      </HelperText>
    </FormControl>
  );
};
