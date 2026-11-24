import { useMemo, useEffect, useState, useRef } from "react";
import { ValueGetterParams } from "@ag-grid-community/core";
import { MetricCatalogItem, MetricDisplayType } from "@api/types";
import { formatMetric } from "@utils/metrics";
import { CompanyRow } from "../helpers/mapCompaniesToRows";
import { RowLevel } from "../types/RowLevel";
import { getMetricData } from "../helpers/getMetricData";

interface RealTimeCellProps {
  params: ValueGetterParams<CompanyRow>;
  catalogFields: MetricCatalogItem[];
  realtimeField: string;
  bloombergField: string;
  metricKey: string;
}

type PriceDirection = "up" | "down" | "unchanged" | null;

const PRICE_DIRECTION_CONFIG = {
  up: { animationClass: "price-flash-up" },
  down: { animationClass: "price-flash-down" },
  unchanged: { animationClass: "" },
} as const;

const ANIMATION_DURATION = 500;

const getPriceDirection = (
  currentValue: number,
  previousValue: number | null
): PriceDirection => {
  if (previousValue === null) return null;
  if (currentValue > previousValue) return "up";
  if (currentValue < previousValue) return "down";
  return "unchanged";
};

export const RealTimeCell = ({
  params,
  catalogFields,
  realtimeField,
  bloombergField,
  metricKey,
}: RealTimeCellProps) => {
  const [animation, setAnimation] = useState<"up" | "down" | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRealtimeValueRef = useRef<number | undefined>(undefined);

  const priceHistory = useMemo(
    () => params.data?.realtimePriceHistory,
    [params.data]
  );

  const latestData = useMemo(
    () => priceHistory?.[priceHistory.length - 1] ?? null,
    [priceHistory]
  );

  const realtimeValue = useMemo(
    () =>
      latestData?.[realtimeField as keyof typeof latestData] as
        | number
        | undefined,
    [latestData, realtimeField]
  );

  const bloombergValue = useMemo(
    () =>
      params.data?.[bloombergField as keyof CompanyRow] as number | undefined,
    [params.data, bloombergField]
  );

  const value = useMemo(
    () => realtimeValue ?? bloombergValue,
    [realtimeValue, bloombergValue]
  );

  const metricDisplayType = useMemo(() => {
    return getMetricData(catalogFields, metricKey)
      ?.display_type as MetricDisplayType;
  }, [catalogFields, metricKey]);

  const formattedValue = useMemo(() => {
    return formatMetric(value, metricDisplayType);
  }, [value, metricDisplayType]);

  useEffect(() => {
    if (
      realtimeValue !== undefined &&
      realtimeValue !== lastRealtimeValueRef.current
    ) {
      const previousRealtimeValue = lastRealtimeValueRef.current;
      lastRealtimeValueRef.current = realtimeValue;

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      const direction = getPriceDirection(
        realtimeValue,
        previousRealtimeValue ?? null
      );

      if (direction === "up" || direction === "down") {
        setAnimation(direction);
        animationTimeoutRef.current = setTimeout(() => {
          setAnimation(null);
        }, ANIMATION_DURATION);
      } else if (previousRealtimeValue !== undefined) {
        setAnimation(null);
      }
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [realtimeValue]);

  const isCompanyRow = useMemo(
    () => params.node?.level === RowLevel.Company,
    [params.node?.level]
  );

  const baseColorClass = useMemo(
    () => (Number(value) > 0 ? "text-green-500" : "text-red-500"),
    [value]
  );

  const animationClass = useMemo(
    () => (animation ? PRICE_DIRECTION_CONFIG[animation].animationClass : ""),
    [animation]
  );

  if (!isCompanyRow) return "";
  if (!value)
    return (
      <div className="flex items-center h-full w-full pl-2">
        <span>-</span>
      </div>
    );

  return (
    <div
      className={`flex items-center h-full w-full pl-2 price-flash ${animationClass}`}
    >
      <span className={baseColorClass}>{formattedValue}</span>
    </div>
  );
};
