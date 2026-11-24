import React, { useEffect, useState, useMemo, useRef } from "react";
import { numToDollar } from "@/utils";
import { PriceUpdate } from "@/typings/RealtimePricing";

export interface PriceCellValue {
  realtimePriceHistory?: PriceUpdate[];
  lastPriceBbg?: number | null;
}

interface PriceCellProps {
  value: PriceCellValue;
}

type PriceDirection = "up" | "down" | "unchanged" | null;

const PRICE_DIRECTION_CONFIG = {
  up: { animationClass: "price-flash-up" },
  down: { animationClass: "price-flash-down" },
  unchanged: { animationClass: "" },
} as const;

const ANIMATION_DURATION = 500;

const getPriceDirection = (
  currentPrice: number,
  previousPrice: number | null
): PriceDirection => {
  if (previousPrice === null) return null;
  if (currentPrice > previousPrice) return "up";
  if (currentPrice < previousPrice) return "down";
  return "unchanged";
};

export const PriceCell: React.FC<PriceCellProps> = ({ value }) => {
  const realtimePriceHistory = useMemo(
    () => value?.realtimePriceHistory || [],
    [value?.realtimePriceHistory]
  );
  const lastPriceBbg = useMemo(
    () => value?.lastPriceBbg,
    [value?.lastPriceBbg]
  );

  const hasRealtimeData = useMemo(
    () => realtimePriceHistory && realtimePriceHistory.length > 0,
    [realtimePriceHistory]
  );

  const formattedBbgPrice = useMemo(
    () => (lastPriceBbg ? numToDollar(lastPriceBbg) : null),
    [lastPriceBbg]
  );

  if (hasRealtimeData) {
    return <RealtimePriceCell realtimePriceHistory={realtimePriceHistory} />;
  }

  if (lastPriceBbg) {
    return (
      <div className="flex items-center h-full w-full pl-2">
        <span className="text-white">{formattedBbgPrice}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center h-full w-full pl-2">
      <span className="text-white">-</span>
    </div>
  );
};

const RealtimePriceCell: React.FC<{
  realtimePriceHistory: PriceUpdate[];
}> = ({ realtimePriceHistory }) => {
  const [animation, setAnimation] = useState<"up" | "down" | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastPriceRef = useRef<number | undefined>(undefined);

  const latestData = useMemo(
    () => realtimePriceHistory[realtimePriceHistory.length - 1],
    [realtimePriceHistory]
  );

  const currentPrice = useMemo(() => latestData?.price || 0, [latestData]);

  const formattedPrice = useMemo(
    () => numToDollar(currentPrice),
    [currentPrice]
  );

  const animationClass = useMemo(
    () => (animation ? PRICE_DIRECTION_CONFIG[animation].animationClass : ""),
    [animation]
  );

  useEffect(() => {
    if (currentPrice !== undefined && currentPrice !== lastPriceRef.current) {
      const previousPrice = lastPriceRef.current;
      lastPriceRef.current = currentPrice;

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      const direction = getPriceDirection(currentPrice, previousPrice ?? null);

      if (direction === "up" || direction === "down") {
        setAnimation(direction);
        animationTimeoutRef.current = setTimeout(() => {
          setAnimation(null);
        }, ANIMATION_DURATION);
      } else if (previousPrice !== undefined) {
        setAnimation(null);
      }
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [currentPrice]);

  return (
    <div
      className={`flex items-center h-full w-full pl-2 price-flash ${animationClass}`}
    >
      <span className="text-white">{formattedPrice}</span>
    </div>
  );
};
