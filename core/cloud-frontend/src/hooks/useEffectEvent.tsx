import { useCallback, useInsertionEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useEffectEvent<T extends (...args: any[]) => any>(
  fn: T
): (...funcArgs: Parameters<T>) => ReturnType<T> {
  const ref = useRef(fn);

  useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);

  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    const f = ref.current;
    return f(...args);
  }, []);
}
