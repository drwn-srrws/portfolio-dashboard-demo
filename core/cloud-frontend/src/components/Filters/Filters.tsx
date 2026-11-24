import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { z, ZodObject } from "zod";

import AutoForm from "../ui/auto-form";
import { FieldConfig } from "../ui/auto-form/types";
import { ZodObjectOrWrapped } from "../ui/auto-form/utils";
import { Button } from "../ui/button";

export interface FiltersProps<TFilters> {
  onFiltersChange: (filters: TFilters) => void;
  filters: TFilters;
  schema: ZodObjectOrWrapped;
  fieldConfig?: FieldConfig<Partial<TFilters>>;
  className?: string;
  formClassName?: string;
  startingFormValues?: TFilters;
  showResetButton?: boolean;
}

export const Filters = <TFilters,>({
  onFiltersChange,
  schema,
  fieldConfig,
  className,
  formClassName,
  startingFormValues,
  showResetButton = true,
}: FiltersProps<TFilters>) => {
  // const { currentParams, replaceChangedParams } = useQueryParams();
  const [values, setValues] = useState<Partial<TFilters>>(
    startingFormValues || {}
  );

  const resetValues = useCallback(() => {
    const newValues = {} as Partial<TFilters>;
    const schemaProps = (schema as ZodObject<z.infer<typeof schema>>).shape;

    for (const key in schemaProps) {
      const prop = schemaProps[key];
      /**
       * Zod deeply nests values, requiring recursive checks for access.
       * In this case, in order to ensure filters appear as "not required",
       * we need to make `optional` the last function (and therefore object)
       * in the Zod object for each filter's definition.
       *
       * I.e., most filters are defined as z.<type>().default(<val>).optional()
       *
       * This means that the first `defaultValue` will work for some filters,
       * while all others require checking the default value of the inner type.
       */
      const defaultValue =
        prop._def.defaultValue?.() || prop._def.innerType._def.defaultValue?.();

      newValues[key as keyof TFilters] = defaultValue || "";
    }

    setValues(newValues);
  }, [schema]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setValues(startingFormValues || {});
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, [startingFormValues]);

  // useEffect(() => {
  //   setValues(currentParams as Partial<TFilters>);
  // }, [currentParams]);

  useEffect(() => {
    onFiltersChange(values as TFilters);
    // replaceChangedParams(values as Record<string, Param>);
  }, [onFiltersChange, values]);

  return (
    <section className="flex items-end gap-x-4">
      <AutoForm
        className={className}
        formClassName={formClassName}
        formSchema={schema}
        onValuesChange={(filters) => setValues(filters as TFilters)}
        fieldConfig={fieldConfig}
        values={values}
      />
      {showResetButton && (
        <div className="flex items-end">
          <Button
            className="h-10 gap-x-2 px-3"
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              resetValues();
            }}
          >
            Reset
            <X className="size-5" />
          </Button>
        </div>
      )}
    </section>
  );
};
