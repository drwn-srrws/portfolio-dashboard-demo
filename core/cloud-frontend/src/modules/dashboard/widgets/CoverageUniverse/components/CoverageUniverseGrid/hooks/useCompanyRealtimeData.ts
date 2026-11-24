import { useMemo } from "react";
import { useInstrumentSocket } from "@/hooks/useInstrumentSocket";
import { CompanyRow } from "../../../helpers/mapCompaniesToRows";
import { useIntradayBarsData } from "../../../hooks/useIntradayBarsData";
import {
  combineSparklineData,
  formatSparklineDataForAgGrid,
} from "../../../utils/sparklineDataFormatter";
import { CompanyResponse } from "@/api/types";

const EMPTY_PRICE_HISTORY: never[] = [];

export const useCompanyRealtimeData = ({
  rows,
  loading,
}: {
  rows: CompanyRow[];
  loading?: boolean;
}) => {
  const primaryInstrumentIds = useMemo(() => {
    const ids: number[] = [];
    for (const company of rows) {
      const instrumentId = company.primary_instrument?.id;
      if (instrumentId) {
        ids.push(instrumentId);
      }
    }
    return ids;
  }, [rows]);

  const { intradayBarsData, isLoadingIntradayBars } = useIntradayBarsData(
    rows as CompanyResponse[]
  );

  const { serverData: realtimeData } = useInstrumentSocket({
    url: "/api/dev/instrument/get-realtime-ticks",
    instrumentIds: primaryInstrumentIds,
    batchTimeMs: 1000,
  });

  const realtimeDataMap = useMemo(() => {
    return new Map(Object.entries(realtimeData));
  }, [realtimeData]);

  const companyWithRealtimePrice = useMemo(() => {
    if (loading) return rows;

    return rows.map((company) => {
      const instrumentId = company.primary_instrument?.id;

      if (!instrumentId) {
        return {
          ...company,
          realtimePriceHistory: EMPTY_PRICE_HISTORY,
        };
      }

      const priceHistory = realtimeDataMap.get(String(instrumentId));

      return {
        ...company,
        realtimePriceHistory: priceHistory || EMPTY_PRICE_HISTORY,
        dtd_price_curve: formatSparklineDataForAgGrid(
          combineSparklineData(instrumentId, intradayBarsData, realtimeData)
        ),
      };
    });
  }, [rows, realtimeDataMap, loading, intradayBarsData, realtimeData]);

  return { data: companyWithRealtimePrice, isLoadingIntradayBars };
};
