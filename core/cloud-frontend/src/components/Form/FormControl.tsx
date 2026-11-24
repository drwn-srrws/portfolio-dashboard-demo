import { ReactNode } from "react";

import { HelperText } from "../HelperText";
import { Button, Label } from "../ui";
import { Tooltip } from "../Tooltip/Tooltip";
import { Icon } from "../Icon/Icon";

export interface FormControlProps {
  id?: string;
  required?: boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
  tip?: string;
  tooltip?: string;
  children?: ReactNode;
}

export const FormControl = ({
  id,
  error,
  label,
  helperText,
  tip,
  tooltip,
  children,
  required,
}: FormControlProps) => (
  <div className="flex flex-col gap-2">
    {(label || tip || tooltip) && (
      <div className="flex flex-row items-center gap-2">
        {label && (
          <Label htmlFor={id} className="text-base flex items-stretch">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        {tooltip && (
          <Tooltip
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="size-5 flex rounded-sm"
              >
                <Icon name="Info" color="#fff" size="md" />
              </Button>
            }
            content={tooltip}
            contentClasses="backdrop-blur-md shadow-2xl rounded-xl w-fit bg-neutral-800 text-white max-w-[277px] min-w-[150px] border border-neutral-600 rounded-sm p-2 text-xs"
            side="right"
          />
        )}
        {tip && (
          <span className="text-sm font-normal italic text-neutral-400">
            {tip}
          </span>
        )}
      </div>
    )}
    {children}
    {helperText && <HelperText error={error}>{helperText}</HelperText>}
  </div>
);
