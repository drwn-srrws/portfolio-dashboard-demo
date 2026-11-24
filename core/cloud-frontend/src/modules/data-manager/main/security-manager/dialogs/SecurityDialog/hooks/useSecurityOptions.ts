import { useMemo } from "react";

import { AssetClass } from "@api/types/index";
import { capitalize } from "@/utils/strings";
export const useSecurityOptions = () => {
  const securityTypeOptions = useMemo(
    () =>
      Object.values(AssetClass).map((type) => ({
        label: capitalize(type),
        value: type,
      })),
    []
  );

  return { securityTypeOptions };
};
