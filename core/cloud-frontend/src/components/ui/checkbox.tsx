import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";

import { cn } from "@/utils/utils";
import { Icon } from "@/components/Icon/Icon";
import { cva, VariantProps } from "class-variance-authority";

const checkboxVariants = cva(
  "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-primary-foreground",
  {
    variants: {
      color: {
        primary: "data-[state=checked]:bg-primary",
        green:
          "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 data-[state=checked]:text-white",
      },
    },
  }
);

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
    VariantProps<typeof checkboxVariants>
>(({ className, color = "primary", ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-id="checkbox/root"
    className={checkboxVariants({ color, className })}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
      data-id="checkbox/indicator"
    >
      <Icon
        name="Check"
        color="currentColor"
        size="sm"
        data-id="checkbox/icon"
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
