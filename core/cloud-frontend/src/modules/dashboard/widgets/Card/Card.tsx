import { ReactNode } from "react";

import { cn } from "@/utils/utils";

interface Props {
  title: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

const Card = ({ title, children, className, actions }: Props) => (
  <div
    className={cn(
      "flex min-h-0 flex-1 flex-col overflow-auto rounded-2xl border border-solid border-neutral-800 p-6",
      className
    )}
  >
    <div className="mb-4 flex items-center">
      <h4 className="relative z-[2] text-lg font-semibold">{title}</h4>
      {actions}
    </div>
    {children}
  </div>
);

export default Card;
