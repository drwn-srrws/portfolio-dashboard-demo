import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useGetDrugKpiChartConfig,
  useGetDrugVendorEstimates,
} from "@api/endpoints/drugs/drugs";
import type { MetricSeries } from "@api/types";
import { Icon } from "@/components/Icon/Icon";
import { MainWrapper } from "@/components/MainWrapper";
import { Button } from "@components/ui/button";
import { routes } from "@/utils/routes";

import { exportDrugChartCsv, exportDrugPageXlsx } from "./utils/drugCsvExport";
import { FALLBACK_TEMPLATE } from "./components/PaidTrxTrendChart/PaidTrxTrendChart.utils";

import { DrugSearchCombobox } from "./components/DrugSearchCombobox";
import { PaidTrxTrendChart } from "./components/PaidTrxTrendChart";
import { VendorEstimatesTable } from "./components/VendorEstimatesTable";

export const DrugDetailPage = () => {
  const navigate = useNavigate();
  const { drugName: rawDrugName } = useParams();
  const drugName = rawDrugName ? decodeURIComponent(rawDrugName) : "";

  const [hoveredSource, setHoveredSource] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const highlightedSource = hoveredSource ?? selectedSource;
  const [chartSeries, setChartSeries] = useState<MetricSeries[]>([]);

  const { data: config } = useGetDrugKpiChartConfig();
  const defaultTemplate =
    config?.metadata.default_templates?.[0] ?? FALLBACK_TEMPLATE;
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const effectiveTemplate = selectedTemplate ?? defaultTemplate;

  const { data: vendorEstimates } = useGetDrugVendorEstimates(
    drugName,
    { template_names: [effectiveTemplate] },
    {
      query: { enabled: !!drugName },
    }
  );

  const handleSeriesChange = useCallback((series: MetricSeries[]) => {
    setChartSeries(series);
  }, []);

  useEffect(() => {
    setHoveredSource(null);
    setSelectedSource(null);
    setChartSeries([]);
  }, [drugName]);

  useEffect(() => {
    setHoveredSource(null);
    setSelectedSource(null);
  }, [effectiveTemplate]);

  const handleSelectDrug = (nextDrugName: string) => {
    navigate(routes.drugDetail(encodeURIComponent(nextDrugName)));
  };

  return (
    <MainWrapper>
      {drugName ? (
        <div className="flex h-full flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="mt-2 text-4xl font-semibold capitalize">
              {drugName}
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={!chartSeries.length}
                className="h-10 gap-2"
                onClick={() => exportDrugChartCsv(drugName, chartSeries)}
              >
                <Icon name="Download" size="sm" color="currentColor" />
                Download Chart
              </Button>
              <Button
                variant="outline"
                disabled={!chartSeries.length}
                className="h-10 gap-2"
                onClick={() =>
                  exportDrugPageXlsx(drugName, chartSeries, vendorEstimates)
                }
              >
                <Icon name="Download" size="sm" color="currentColor" />
                Download Page
              </Button>
              <DrugSearchCombobox
                value={drugName}
                onSelect={handleSelectDrug}
              />
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto">
            <PaidTrxTrendChart
              drugName={drugName}
              highlightedSource={highlightedSource}
              onSeriesChange={handleSeriesChange}
              selectedTemplate={effectiveTemplate}
              onTemplateChange={setSelectedTemplate}
            />
            <VendorEstimatesTable
              drugName={drugName}
              selectedTemplate={effectiveTemplate}
              onHoverSource={setHoveredSource}
              onSelectSource={setSelectedSource}
            />
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-8 pb-24">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-5xl font-bold tracking-tight">
              Commercial Dashboard
            </h1>
            <p className="text-base text-muted-foreground">
              One destination for all commercial KPIs. Search any drug to get
              started.
            </p>
          </div>
          <DrugSearchCombobox
            value=""
            onSelect={handleSelectDrug}
            className="w-full max-w-2xl"
            large
          />
        </div>
      )}
    </MainWrapper>
  );
};
