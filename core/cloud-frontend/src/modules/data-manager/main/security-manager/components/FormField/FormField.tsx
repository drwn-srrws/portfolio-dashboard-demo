import { useCallback, useMemo, useRef, useState } from "react";
import { Control, Path } from "react-hook-form";

import { useResource } from "../../dialogs/SecurityDialog/hooks/useResource";
import {
  FormFieldOptions,
  FormFieldResource,
  FormFieldType,
} from "@/api/types";
import { FormTextField } from "@/components/Form/FormTextField";
import { FormInfiniteTextSelect } from "../../form/FormInfiniteTextSelect";
import { FormInfiniteMultiSelect } from "../../form/FormInfiniteMultiSelect";
import { useQueryClient } from "@tanstack/react-query";
import { debounce } from "@/utils";
import { Resource } from "../../dialogs/SecurityDialog/types";
import { FormAuditField } from "../FormAuditField";
import { Tooltip } from "@/components/Tooltip/Tooltip";
import { Icon } from "@/components/Icon/Icon";

const INPUT_COMPONENTS = {
  [FormFieldType.string]: FormTextField,
  [FormFieldType.select]: FormInfiniteTextSelect,
  [FormFieldType["multi-select"]]: FormInfiniteMultiSelect,
  [FormFieldType["audit"]]: FormAuditField,
} as const;

interface FormFieldProps<T extends Record<string, unknown>> {
  name: Path<T>;
  label: string;
  type: FormFieldType;
  required: boolean;
  resource?: FormFieldResource;
  options?: FormFieldOptions;
  control: Control<T>;
  disabled?: boolean;
  params?: Record<string, string | number>;
  tooltip?: string;
}

export const FormField = <T extends Record<string, unknown>>({
  name,
  label,
  type,
  required,
  resource,
  options,
  control,
  disabled,
  params,
  tooltip,
}: FormFieldProps<T>) => {
  const queryClient = useQueryClient();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSetSearchQueryRef = useRef(
    debounce((value: string) => {
      queryClient.removeQueries({ queryKey: [resource] });
      setSearchQuery(value);
    }, 300)
  );

  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    supportsClientFilter,
  } = useResource({
    resource: resource as Resource,
    searchQuery,
    customOptions: options,
    params,
  });

  const debouncedSearchQuery = useCallback(
    (value: string) => {
      setSearchInputValue(value);
      debouncedSetSearchQueryRef.current(value);
    },
    [setSearchInputValue]
  );

  const InputComponent = useMemo(() => {
    if (!(type in INPUT_COMPONENTS)) {
      console.error(`Unsupported field type: ${type}`);
      return null;
    }
    return INPUT_COMPONENTS[type as keyof typeof INPUT_COMPONENTS];
  }, [type]);

  return (
    <>
      {InputComponent && (
        <div className="flex flex-col gap-2 min-h-[56px] w-full">
          <div className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base flex items-center gap-1.5">
            <span>{label}</span>
            {required && <span className="text-red-500"> *</span>}
            {tooltip && (
              <Tooltip
                trigger={
                  <span className="inline-flex cursor-help text-neutral-400 hover:text-neutral-200">
                    <Icon name="Info" color="currentColor" size="sm" />
                  </span>
                }
                content={tooltip}
                contentClasses="backdrop-blur-md shadow-2xl w-fit bg-neutral-800 text-white max-w-[277px] min-w-[150px] border border-neutral-600 rounded-sm p-2 text-xs"
                side="right"
              />
            )}
          </div>
          <div className="flex-1">
            <InputComponent
              name={name}
              control={control}
              options={data || []}
              placeholder={type === FormFieldType.string ? label : "Select"}
              search={searchInputValue}
              onSearchChange={debouncedSearchQuery}
              isLoadingMore={hasNextPage && isFetchingNextPage}
              isLoadingOptions={!options?.length && isFetchingNextPage}
              onLoadMore={() =>
                hasNextPage && !isFetchingNextPage && fetchNextPage()
              }
              disabled={disabled}
              disableFiltering={!supportsClientFilter}
              testId={`editSecurityFormField-[name-${name}]-[required-${required}]-[disabled-${disabled}]-[type-${type}]`}
              className="h-10"
            />
          </div>
        </div>
      )}
    </>
  );
};
