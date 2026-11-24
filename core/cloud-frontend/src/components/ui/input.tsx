import * as React from "react";

import { cn } from "@/utils/utils";
import { cva, VariantProps } from "class-variance-authority";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, startAdornment, endAdornment, hidden, ...props },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => inputRef.current
    );

    const handleFocus = React.useCallback(() => {
      inputRef.current?.focus();
    }, []);

    return (
      <div
        hidden={hidden}
        data-id="input/root"
        className={cn(
          "flex w-full h-10 m-0 overflow-hidden cursor-text rounded-lg border border-input focus-within:ring-2 focus-within:ring-ring",
          className
        )}
        onClick={handleFocus}
      >
        {startAdornment}
        <input
          type={type}
          className={cn(
            "flex py-2 px-3 w-full text-sm rounded-lg bg-transparent ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50",
            type === "number" &&
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          )}
          ref={inputRef}
          {...props}
        />
        {endAdornment}
      </div>
    );
  }
);
Input.displayName = "Input";

const inputAdornment = cva("flex items-center justify-center px-2", {
  variants: {
    variant: {
      transparent: "bg-transparent",
      contained: "bg-neutral-800 text-neutral-500",
    },
  },
  defaultVariants: {
    variant: "contained",
  },
});

export interface InputAdornmentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputAdornment> {
  children: React.ReactNode;
}

const InputAdornment = React.forwardRef<HTMLDivElement, InputAdornmentProps>(
  ({ children, className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-id="input/adornment"
        className={inputAdornment({ variant, className })}
        {...props}
      >
        {children}
      </div>
    );
  }
);
InputAdornment.displayName = "InputAdornment";

export { Input, InputAdornment };
