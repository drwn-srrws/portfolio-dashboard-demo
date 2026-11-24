import { format } from "date-fns";
import { MetricCatalogItem, MetricDisplayType } from "@api/types";
import { formatMetric } from "@utils/metrics";
import { getMetricData } from "../helpers/getMetricData";
import { CompanyRow } from "./mapCompaniesToRows";
import { ValueGetterParams } from "@ag-grid-community/core";

export const realtimeTooltipRenderer =
  (catalogFields: MetricCatalogItem[] = []) =>
  (
    params: ValueGetterParams<CompanyRow> & { xValue: number; yValue: number }
  ) => {
    if (!params.xValue) return null;

    const date = new Date(params.xValue * 1000);

    if (!date) return "";

    const currentPrice = params.yValue;

    const formattedPrice = formatMetric(
      currentPrice,
      getMetricData(catalogFields, "last_price_bbg")
        ?.display_type as MetricDisplayType
    );

    const eodDtdDollarReturn = params.context.data?.dtd_dollar_return_bbg || 0;
    const eodDtdPercentReturn =
      params.context.data?.dtd_percent_return_bbg || 0;

    const realTimeData = params.context.data?.realtimePriceHistory;
    const realTimeLatestEntry = realTimeData?.[realTimeData.length - 1];

    const realtimeDtdDollarReturn = realTimeLatestEntry?.dtd_daily_return || 0;
    const realtimeDtdPercentReturn =
      realTimeLatestEntry?.dtd_percent_return || 0;

    const dtdDolarReturn = realTimeLatestEntry
      ? realtimeDtdDollarReturn
      : eodDtdDollarReturn;
    const dtdPercentReturn = realTimeLatestEntry
      ? realtimeDtdPercentReturn
      : eodDtdPercentReturn;

    const titleColor = dtdPercentReturn >= 0 ? "#2EAE5C" : "#E03C31";

    const formattedDtdDollarReturn = formatMetric(
      dtdDolarReturn,
      getMetricData(catalogFields, "dtd_dollar_return_bbg")
        ?.display_type as MetricDisplayType
    );

    const formattedDtdPercentReturn = formatMetric(
      dtdPercentReturn,
      MetricDisplayType.percent
    );

    return `
    <div style="
      display: flex;
      flex-direction: column;
      gap: 2px;
      border-radius: 6px;
      background: rgb(38, 38, 38);
      padding: 3px 6px;
      border: 1px solid #525252;
    ">
      <div style="color: ${titleColor}; font-weight: 600; font-size: 9px;">
        ${params.context.data.name}
      </div>
      <div style="display: flex; flex-direction: column; font-size: 8px; color: #fff;">
        <div>Time: ${format(date, "HH:mm:ss")}</div>
        <div>Price: ${formattedPrice}</div>
        <div>DTD Return: ${formattedDtdDollarReturn} (${formattedDtdPercentReturn})</div>
      </div>
    </div>
  `;
  };
