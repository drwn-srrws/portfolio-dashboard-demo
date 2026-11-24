import { useEffect, useRef, useState } from "react";

import { useCrosshair } from "../../hooks/useCrosshair";

export interface Coords {
  x: number;
  y: number;
}

export const ChartTooltip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { tooltip, mouseX, mouseY } = useCrosshair();
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setTooltipHeight(ref.current.offsetHeight);
    }
  }, [tooltip]);

  if (!mouseX || !mouseY || !tooltip) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute z-[1000] flex flex-col gap-2 rounded-lg border border-solid border-neutral-600 bg-neutral-800 p-2"
      style={{
        left: mouseX,
        top: mouseY,
        marginTop: `-${(tooltipHeight ?? 2) / 2}px`,
      }}
      dangerouslySetInnerHTML={{ __html: tooltip }}
    />
  );
};
