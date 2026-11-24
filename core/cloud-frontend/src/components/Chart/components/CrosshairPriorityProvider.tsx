import { ReactNode, useCallback, useMemo, useRef } from "react";
import { CrosshairPriorityContext } from "../context/CrosshairPriorityContext";
import { ISeriesRef } from "../typings/ISeriesRef";

export interface CrosshairPriorityProviderProps {
  children: ReactNode;
}

export const CrosshairPriorityProvider = ({
  children,
}: CrosshairPriorityProviderProps) => {
  const prioritySeriesRefs = useRef<ISeriesRef[]>([]);

  const registerPriority = useCallback((ref: ISeriesRef) => {
    if (!prioritySeriesRefs.current.includes(ref)) {
      prioritySeriesRefs.current = [...prioritySeriesRefs.current, ref];
    }
  }, []);

  const unregisterPriority = useCallback((ref: ISeriesRef) => {
    prioritySeriesRefs.current = prioritySeriesRefs.current.filter(
      (current) => current !== ref
    );
  }, []);

  const context = useMemo(
    () => ({ prioritySeriesRefs, registerPriority, unregisterPriority }),
    [registerPriority, unregisterPriority]
  );

  return (
    <CrosshairPriorityContext.Provider value={context}>
      {children}
    </CrosshairPriorityContext.Provider>
  );
};
