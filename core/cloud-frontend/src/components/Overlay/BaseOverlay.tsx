import { DatabaseZap } from "lucide-react";
import { ReactNode } from "react";

import { cn } from "@/utils/utils";

export interface BaseOverlayProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  children?: ReactNode;
  testId?: string;
}

export const BaseOverlay = ({
  icon = <DatabaseZap />,
  title,
  description,
  children,
  testId,
}: BaseOverlayProps) => (
  <div
    data-testid={testId}
    className="flex h-full flex-col items-center justify-center gap-4"
  >
    <div className="flex items-center justify-center rounded-full border border-neutral-400 bg-neutral-950 p-3">
      {icon}
    </div>
    <div className="flex flex-col items-center justify-center gap-3">
      {title && (
        <h3 className="max-w-[90%] whitespace-pre-line break-words text-center text-lg font-semibold">
          {title}
        </h3>
      )}
      {description && (
        <p
          className={cn(
            "text-neutral-400 max-w-72 text-center break-words whitespace-pre-line",
            title ? "text-sm" : "text-lg"
          )}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  </div>
);
