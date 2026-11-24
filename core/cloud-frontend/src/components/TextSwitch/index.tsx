import { SwitchProps } from "@radix-ui/react-switch";
import { forwardRef, useId } from "react";

import { FormControl, FormControlProps } from "@/components/Form/FormControl";
import { Switch } from "@components/ui/switch";
import { Tooltip } from "../Tooltip/Tooltip";
import { Icon } from "../Icon/Icon";
import { Button } from "../ui";

export interface TextSwitchProps extends SwitchProps, FormControlProps {
  tooltip?: string;
  testId?: string;
}

export const TextSwitch = forwardRef<HTMLButtonElement, TextSwitchProps>(
  (
    {
      helperText,
      error,
      tip,
      label,
      required,
      tooltip,
      testId = "text-switch",
      ...props
    },
    ref
  ) => {
    const id = useId();

    return (
      <FormControl
        error={error}
        helperText={helperText}
        tip={tip}
        required={required}
      >
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex flex-row items-center gap-2">
            {label && (
              <label
                htmlFor={id}
                className="line-clamp-1 text-base font-medium"
              >
                {label}
              </label>
            )}
            {tooltip && (
              <Tooltip
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5 flex rounded-sm"
                  >
                    <Icon name="Info" color="#fff" size="sm" />
                  </Button>
                }
                content={tooltip}
                contentClasses="backdrop-blur-md shadow-2xl rounded-xl w-fit bg-neutral-800 text-white max-w-[277px] min-w-[150px] border border-neutral-600 rounded-sm p-2 text-xs"
                side="right"
              />
            )}
          </div>
          <Switch {...props} ref={ref} id={id} data-testid={testId} />
        </div>
      </FormControl>
    );
  }
);
