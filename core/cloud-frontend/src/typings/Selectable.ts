import { CheckedState } from "@radix-ui/react-checkbox";

export interface Selectable {
  value: string | number | boolean;
  label: string;
  checked?: CheckedState;
  order?: number;
  deprecated?: boolean;
  tooltip?: string;
}

export type SelectableGroup = {
  [option: string]: Selectable;
};
