import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, ReactNode } from "react";

export type MainWrapperVariants = {
  variant: {
    rounded: string;
    default: string;
  };
};

const mainWrapperVariants = cva<MainWrapperVariants>(
  "relative flex w-full min-h-0 flex-1 flex-col bg-neutral-900",
  {
    variants: {
      variant: {
        rounded: "py-2 pr-2",
        default: "",
      },
    },
  }
);

const mainContainerVariants = cva<MainWrapperVariants>(
  "flex size-full flex-col md:border md:border-neutral-800 bg-neutral-950 p-4 overflow-scroll",
  {
    variants: {
      variant: {
        rounded: "md:rounded-2xl",
        default: "md:rounded-tl-2xl border-b-0 border-r-0",
      },
    },
  }
);

export interface MainWrapperProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mainWrapperVariants> {
  children: ReactNode;
}

export const MainWrapper = ({
  children,
  variant = "default",
  className,
  ...props
}: MainWrapperProps) => (
  <div className={mainWrapperVariants({ variant, className })} {...props}>
    <div className={mainContainerVariants({ variant })}>
      <div className="flex flex-col flex-1">{children}</div>
    </div>
  </div>
);
