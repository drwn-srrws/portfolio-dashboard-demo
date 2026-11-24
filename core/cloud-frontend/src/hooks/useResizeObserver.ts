import { RefObject, useEffect, useState } from "react";

export interface ISize {
  width: number;
  height: number;
}

export interface UseResizeObserverProps {
  ref: RefObject<HTMLElement | null>;
  onResize?: (entry: ResizeObserverEntry) => void;
}

export const useResizeObserver = ({
  ref,
  onResize,
}: UseResizeObserverProps) => {
  const [size, setSize] = useState<ISize>({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const height = entry.contentRect.height;
      const width = entry.contentRect.width;
      onResize?.(entry);
      setSize({ height, width });
    });

    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, [onResize, ref]);

  return size;
};
