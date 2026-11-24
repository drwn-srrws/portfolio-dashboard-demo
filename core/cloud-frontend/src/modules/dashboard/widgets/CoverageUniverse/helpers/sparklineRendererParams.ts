import { format } from "date-fns";
import { CustomCellRendererProps } from "@ag-grid-community/react";
import {
  CompanyResponse as Company,
  MetricCatalogItem,
  MetricDisplayType,
} from "@api/types";
import { parseDateString } from "@/utils";
import { formatMetric } from "@utils/metrics";
import { getMetricData } from "../helpers/getMetricData";

const YTD_RETURN_COLORS = {
  positive: "#2EAE5C",
  negative: "#E03C31",
  neutral: "#9CA3AF",
} as const;

const getYtdReturnColor = (ytdReturn?: number | null): string => {
  if (!ytdReturn) return YTD_RETURN_COLORS.neutral;
  return ytdReturn > 0
    ? YTD_RETURN_COLORS.positive
    : YTD_RETURN_COLORS.negative;
};

export const tooltipRenderer =
  (catalogFields: MetricCatalogItem[] = []) =>
  (params: {
    xValue: number;
    yValue: number;
    ytd_dollar_return_bbg: number;
    context: { data: Company };
  }) => {
    if (!params.xValue) return null;

    const date = parseDateString(params.xValue.toString());

    if (!date) return "";
    const titleColor = getYtdReturnColor(
      params.context.data?.ytd_dollar_return_bbg
    );

    const formattedPrice = formatMetric(
      params.yValue,
      getMetricData(catalogFields, "last_price_bbg")
        ?.display_type as MetricDisplayType
    );

    const formattedYtdReturn = formatMetric(
      params.context.data?.ytd_dollar_return_bbg,
      getMetricData(catalogFields, "ytd_dollar_return_bbg")
        ?.display_type as MetricDisplayType
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
        <div>Date: ${format(date, "MM/dd/yyyy")}</div>
        <div>Price: ${formattedPrice}</div>
        <div>YTD Return: ${formattedYtdReturn}</div>
      </div>
    </div>
  `;
  };
export const sparklineRendererParams =
  (catalogFields: MetricCatalogItem[] = []) =>
  (params: CustomCellRendererProps<Company>) => {
    return {
      sparklineOptions: {
        type: "line",

        line: {
          stroke: getYtdReturnColor(params.data?.ytd_dollar_return_bbg),
          strokeWidth: 1,
        },

        marker: {
          enabled: false,
        },

        crosshairs: {
          xLine: {
            enabled: true,
            stroke: "#fff",
          },
          yLine: {
            enabled: false,
          },
        },

        padding: {
          top: 5,
          bottom: 5,
        },

        axis: {
          stroke: "rgba(82, 82, 82, 1)",
          strokeWidth: 1,
        },

        tooltip: {
          enabled: true,
          renderer: tooltipRenderer(catalogFields),
        },
      },
    };
  };
