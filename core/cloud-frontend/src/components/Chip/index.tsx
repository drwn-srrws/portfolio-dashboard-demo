import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/utils";

const chipVariants = cva("flex cursor-pointer items-center gap-2", {
  variants: {
    variant: {
      default: "",
      filled:
        "px-2 py-1 rounded leading-none text-white inline-flex items-center bg-neutral-800",
    },
    size: {
      default: "",
      sm: "text-sm",
      md: "text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const indicatorVariants = cva("rounded-md", {
  variants: {
    size: {
      default: "h-4 w-2",
      sm: "h-3 w-1.5",
      md: "h-5 w-2.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface ChipProps extends VariantProps<typeof chipVariants> {
  name: string;
  color?: string;
  className?: string;
}

export const Chip = ({ className, name, color, variant, size }: ChipProps) => {
  return (
    <div className={cn(chipVariants({ variant, size }), className)}>
      <div
        className={indicatorVariants({ size })}
        style={{ backgroundColor: color || "white" }}
      />
      {name}
    </div>
  );
};
