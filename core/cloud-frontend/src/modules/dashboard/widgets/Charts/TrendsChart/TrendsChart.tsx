import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";

import { useGetCompanyPageTrends } from "@api/endpoints/company/company";
import { CompanyPageTrendsResponse, CompanyTrend } from "@api/types/index";

import { CheckboxMultiSelect } from "@/components/CheckboxMultiSelect";
import { Skeleton } from "@components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@components/ui/toggle-group";
import { capitalize } from "@/utils/strings";

import Card from "../../Card/Card";
import { Chart } from "../Chart/Chart";
import { seriesConfig, trendOptions } from "../utils";
import { calculateDateRange, toggleOptions } from "./TrendsChart.utils";

const TrendsChart = () => {
  const params = useParams();
  const { companyId } = params;

  const [filters, setFilters] = useState<{
    multiselect: (string | number)[];
    toggle: string;
  }>({
    multiselect: [CompanyTrend.ytd_pnl],
    toggle: "Year to Date",
  });

  const dateRange = calculateDateRange(filters.toggle);

  const { data: trends, isPending: isLoadingTrends } = useGetCompanyPageTrends(
    Number(companyId),
    {
      start_date: dateRange.start?.toISOString().split("T")[0] || "",
      end_date: dateRange.end?.toISOString().split("T")[0] || "",
      filter: filters.multiselect as Array<CompanyTrend>,
    },
    {
      query: {
        enabled: !!companyId,
      },
    }
  );

  const handleFilters = (
    value: string | (string | number | boolean)[],
    key: "toggle" | "multiselect"
  ) => setFilters({ ...filters, [key]: value });

  const seriesData = useMemo(() => {
    if (!trends) return [];

    return Object.entries(trends).map(
      ([key, value]: [
        string,
        (
          | CompanyPageTrendsResponse["ytd_pnl"]
          | CompanyPageTrendsResponse["price"]
          | CompanyPageTrendsResponse["size"]
        ),
      ]) => ({
        id: key,
        data: value || [],
        title: capitalize(key),
        yKey: key as CompanyTrend,
      })
    );
  }, [trends]);

  const filteredSeriesData = useMemo(() => {
    if (seriesData.length === 0) {
      return [];
    }

    const filteredData = seriesData.filter((series) =>
      filters.multiselect.includes(series.yKey)
    );

    const limitedData = filteredData.slice(0, 2);

    return limitedData.map((series, index) => {
      const config = seriesConfig[series.yKey as CompanyTrend] || {
        color: "rgba(88, 36, 251, 1)",
        priceScaleId: "",
        initialX: 0,
      };

      return {
        ...series,
        color: config.color,
        priceScaleId: index % 2 ? "right" : "left",
        initialX: config.initialX,
      };
    });
  }, [filters.multiselect, seriesData]);

  return (
    <Card
      title="Trends"
      className="pb-6"
      actions={
        <>
          <div className="relative z-[2] ml-10 min-w-40">
            <CheckboxMultiSelect
              options={trendOptions}
              onChange={(value) => handleFilters(value, "multiselect")}
              values={filters.multiselect}
              className="mt-0"
              minSelectable={1}
              maxSelectable={2}
            />
          </div>
          <div className="relative z-[2] ml-6">
            <ToggleGroup
              value={filters.toggle}
              onValueChange={(value) => handleFilters(value, "toggle")}
              size="default"
              type="single"
            >
              {toggleOptions.map(({ value, label }) => (
                <ToggleGroupItem key={value} value={value}>
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </>
      }
    >
      {isLoadingTrends ? (
        <div className="mt-5 flex flex-1 flex-col justify-center gap-5">
          <Skeleton className="w-[full] flex-1" />
        </div>
      ) : (
        !!filteredSeriesData.length && (
          <div className="h-[20rem] w-full md:h-full">
            <Chart series={filteredSeriesData} />
          </div>
        )
      )}
    </Card>
  );
};
export default TrendsChart;
