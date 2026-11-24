import { useLocation } from "react-router-dom";
import { pickBy } from "ramda";
import { useCallback, useEffect, useState } from "react";

import {
  hyphenatedDate,
  isHyphenatedDate,
  parseDateString,
} from "@/utils/index";

export type Param = string | boolean | Date;

export const useQueryParams = () => {
  const pathname = useLocation().pathname;
  const [currentParams, setCurrentParams] = useState<Record<string, Param>>({});
  const [firstRender, setFirstRender] = useState(true);

  const convertParamsToObject = (params: URLSearchParams) => {
    const obj: Record<string, Param> = {};
    for (const key of Array.from(params.keys())) {
      const value = params.get(key);
      if (value) {
        if (value === "true" || value === "false") obj[key] = value === "true";
        else if (isHyphenatedDate(value) && parseDateString(value))
          obj[key] = parseDateString(value)!;
        else obj[key] = value;
      }
    }
    return obj;
  };

  useEffect(() => {
    const { search } = window.location;
    if (search) {
      const params = new URLSearchParams(search);
      const a = Array.from(params.keys());
      let filters: { [key: string]: Param } = {};

      for (const key of a) {
        const value = params.get(key);

        if (value) {
          if (value === "true" || value === "false")
            filters[key] = value === "true";
          else if (isHyphenatedDate(value) && parseDateString(value))
            filters[key] = parseDateString(value)!;
          else filters[key] = value;
        }
      }

      filters = pickBy((value) => value !== "undefined", filters);
      setCurrentParams(filters);
    }
  }, []);

  const replaceChangedParams = useCallback(
    (params: Record<string, Param>) => {
      const searchParams = new URLSearchParams(window.location.search);
      Object.keys(params).forEach((key) => {
        let value = params[key];

        if (typeof value === "boolean") value = value.toString();
        else if (value instanceof Date) value = hyphenatedDate(value);

        if (value && value !== "undefined" && value !== undefined)
          searchParams.set(key, value as string);
        if (!value) searchParams.delete(key);
      });

      window.history.pushState(
        {},
        "",
        `${pathname}?${searchParams.toString()}`
      );
      setCurrentParams(convertParamsToObject(searchParams));
    },
    [pathname]
  );

  const setQueryParams = useCallback(
    (params: Record<string, Param>) => {
      if (firstRender) {
        setFirstRender(false);
        return;
      }

      const searchParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        let value = params[key];

        if (typeof value === "boolean") value = value.toString();
        if (value instanceof Date) value = hyphenatedDate(value);

        if (value && value !== "undefined" && value !== undefined)
          searchParams.set(key, value as string);
      });
      window.history.pushState(
        {},
        "",
        `${pathname}?${searchParams.toString()}`
      );
    },
    [firstRender, pathname]
  );

  const clearQueryParams = useCallback(() => {
    window.history.pushState({}, "", pathname);
  }, [pathname]);

  return {
    currentParams,
    replaceChangedParams,
    setQueryParams,
    clearQueryParams,
  };
};
