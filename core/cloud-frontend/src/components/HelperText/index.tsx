import { cva } from "class-variance-authority";
import { ReactNode } from "react";

const helperText = cva("text-xs", {
  variants: {
    error: {
      true: "text-red-500",
    },
  },
});

export interface HelperTextProps {
  error?: boolean;
  children?: ReactNode;
}

export const HelperText = ({ error, children }: HelperTextProps) => (
  <span className={helperText({ error })}>{children}</span>
);
