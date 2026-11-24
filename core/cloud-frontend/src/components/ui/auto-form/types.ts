import { Selectable } from "@typings/Selectable";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import * as z from "zod";
import { INPUT_COMPONENTS } from "./config";
import { ReactNode } from "react";

export type InputValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | readonly string[];

interface ConversionInputProps<TContext> {
  // All html inputs are strings. Assumes Zod/Autoform will convert based on schema
  inputA: {
    label: string;
    type: string;
  };
  inputB: {
    label: string;
    type: string;
  };
  convertAToB: (value: string, context: TContext) => string | number;
  convertBToA: (value: string, context: TContext) => string | number;
  context: TContext;
  value: string;
}

export type FieldConfigItem = {
  description?: React.ReactNode;
  labelClasses?: string;
  /**
   * This `classes` is meant for the parent div of the input field, which includes
   * the label and input
   */
  classes?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> & {
    /**
     * This `classes` is meant for the input field itself
     */
    classes?: string;
    /**
     * This set of css classes is provided to any children of the input field.
     *
     * For example, you could use this to style the dropdown options of a select field.
     */
    contentClasses?: string;
    showLabel?: boolean;
    options?: Selectable[];
    value?: InputValue;
    nullable?: boolean;
    placeholder?: string;
    label?: ReactNode;
    conversionInput?: ConversionInputProps<number>;
  };
  fieldType?:
    | keyof typeof INPUT_COMPONENTS
    | React.FC<AutoFormInputComponentProps>;

  renderParent?: (props: {
    children: React.ReactNode;
  }) => React.ReactElement | null;
};

export type FieldConfig<SchemaType extends z.infer<z.ZodObject<any, any>>> = {
  // If SchemaType.key is an object, create a nested FieldConfig, otherwise FieldConfigItem
  [Key in keyof SchemaType]?: SchemaType[Key] extends object
    ? FieldConfig<z.infer<SchemaType[Key]>>
    : FieldConfigItem;
};

export enum DependencyType {
  DISABLES,
  REQUIRES,
  HIDES,
  SETS_OPTIONS,
}

type BaseDependency<SchemaType extends z.infer<z.ZodObject<any, any>>> = {
  sourceField: keyof SchemaType;
  type: DependencyType;
  targetField: keyof SchemaType;
  when: (sourceFieldValue: any, targetFieldValue: any) => boolean;
};

export type ValueDependency<SchemaType extends z.infer<z.ZodObject<any, any>>> =
  BaseDependency<SchemaType> & {
    type:
      | DependencyType.DISABLES
      | DependencyType.REQUIRES
      | DependencyType.HIDES;
  };

export type EnumValues = readonly [string, ...string[]];

export type OptionsDependency<
  SchemaType extends z.infer<z.ZodObject<any, any>>,
> = BaseDependency<SchemaType> & {
  type: DependencyType.SETS_OPTIONS;

  // Partial array of values from sourceField that will trigger the dependency
  options: EnumValues;
};

export type Dependency<SchemaType extends z.infer<z.ZodObject<any, any>>> =
  | ValueDependency<SchemaType>
  | OptionsDependency<SchemaType>;

/**
 * A FormInput component can handle a specific Zod type (e.g. "ZodBoolean")
 */
export type AutoFormInputComponentProps = {
  zodInputProps: React.InputHTMLAttributes<HTMLInputElement>;
  field: ControllerRenderProps<FieldValues, any>;
  fieldConfigItem: FieldConfigItem;
  label: string;
  isRequired: boolean;
  fieldProps: any;
  zodItem: z.ZodAny;
  className?: string;
};
