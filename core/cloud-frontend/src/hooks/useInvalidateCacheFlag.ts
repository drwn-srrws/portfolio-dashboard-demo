import { useMemo } from "react";
import { parseAsStringLiteral, useQueryState } from "nuqs";

const invalidateCacheParser = parseAsStringLiteral([
  "true",
  "false",
] as const).withDefault("false");

export const useInvalidateCacheFlag = (): boolean => {
  const [value] = useQueryState("invalidate_cache", invalidateCacheParser);

  const result = useMemo(() => {
    const isTrue = value?.toLowerCase() === "true";
    return isTrue;
  }, [value]);

  return result;
};
