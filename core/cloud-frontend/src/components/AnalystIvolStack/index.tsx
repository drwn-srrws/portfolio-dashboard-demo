import { ReactNode } from "react";

import { IvolSubValue, IvolSubValueProps } from "@/components/IvolSubValue";

export interface AnalystIvolStackProps {
  analystValue: ReactNode;
  isIvolEnabled: boolean;
  ivol: IvolSubValueProps;
}

export const AnalystIvolStack = ({
  analystValue,
  isIvolEnabled,
  ivol,
}: AnalystIvolStackProps) => {
  if (!isIvolEnabled) {
    return <>{analystValue}</>;
  }

  return (
    <div className="flex flex-col leading-tight">
      <div className="grid grid-cols-[28px_1fr] items-center gap-x-1">
        <span className="text-right text-[10px] uppercase leading-none text-neutral-500">
          Est
        </span>
        <div className="text-left">{analystValue}</div>
      </div>
      <IvolSubValue {...ivol} />
    </div>
  );
};
