import { useCallback, useEffect, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

import { useGetDrugKpiChartConfig } from "@api/endpoints/drugs/drugs";
import type {
  ChartRequest,
  DrugsDateRangeRequestPeriod as DrugChartPeriod,
  MetricSeries,
} from "@api/types";
import { BadgeMultiSelect } from "@components/BadgeMultiSelect";
import { DateRangeSinglePicker } from "@components/DateRangeSinglePicker";
import Card from "@/modules/dashboard/widgets/Card/Card";
import { Skeleton } from "@components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@components/ui/toggle-group";

import ErrorBoundary from "@/components/ErrorBoundary";
import { ErrorOverlay } from "@components/Overlay/ErrorOverlay";

import { useDrugKpiChart } from "../../api/useDrugKpiChart";
import { DrugTrxChart } from "./DrugTrxChart";
import { LabeledCheckbox } from "./LabeledCheckbox";
import {
  buildDrugChartLines,
  CUSTOM_PERIOD,
  FALLBACK_PERIOD,
  FALLBACK_PERIODS,
  FALLBACK_TEMPLATE_LABEL_MAP,
  isStlyAllowed,
  periodLabel,
} from "./PaidTrxTrendChart.utils";
import { TrxChartLegend } from "./TrxChartLegend";

export interface PaidTrxTrendChartProps {
  drugName: string;
  highlightedSource?: string | null;
  onSeriesChange?: (series: MetricSeries[]) => void;
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

export const PaidTrxTrendChart = ({
  drugName,
  highlightedSource,
  onSeriesChange,
  selectedTemplate,
  onTemplateChange,
}: PaidTrxTrendChartProps) => {
  const [hiddenSources, setHiddenSources] = useState<string[]>([]);

  useEffect(() => {
    setHiddenSources([]);
  }, [drugName]);

  useEffect(() => {
    setHiddenSources([]);
  }, [selectedTemplate]);

  const { data: config, isLoading: isConfigLoading } =
    useGetDrugKpiChartConfig();

  const periods = config?.metadata.periods ?? FALLBACK_PERIODS;
  const defaultPeriod = config?.metadata.default_period ?? FALLBACK_PERIOD;
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [customRange, setCustomRange] = useState<DateRange | undefined>(
    undefined
  );
  const [showForecast, setShowForecast] = useState(true);
  const [includeStly, setIncludeStly] = useState(false);

  const period = selectedPeriod ?? defaultPeriod;
  const isCustom = period === CUSTOM_PERIOD;
  const stlyAllowed = isStlyAllowed(period);
  const effectiveStly = stlyAllowed && includeStly;

  const handlePeriodChange = useCallback((value: string) => {
    if (!value) return;
    setSelectedPeriod(value);
    if (value !== CUSTOM_PERIOD) setCustomRange(undefined);
  }, []);

  const dateRange = useMemo(() => {
    if (!isCustom) return { period: period as DrugChartPeriod };
    return {
      start_date: customRange?.from
        ? customRange.from.toISOString().slice(0, 10)
        : undefined,
      end_date: customRange?.to
        ? customRange.to.toISOString().slice(0, 10)
        : undefined,
    };
  }, [isCustom, period, customRange]);

  const request: ChartRequest = useMemo(
    () => ({
      drug_name: drugName,
      date_range: dateRange,
      include_stly: effectiveStly,
      template_names: [selectedTemplate],
    }),
    [drugName, dateRange, effectiveStly, selectedTemplate]
  );

  const customRangeReady = !isCustom || !!customRange?.from;

  const {
    data: rawChart,
    isLoading: isChartLoading,
    isFetching: isChartFetching,
  } = useDrugKpiChart(request, {
    enabled: !!drugName && !isConfigLoading && customRangeReady,
  });

  const chart = rawChart?.drug_name === drugName ? rawChart : undefined;

  useEffect(() => {
    onSeriesChange?.(chart?.data ?? []);
  }, [chart, onSeriesChange]);

  const metrics = useMemo(
    () => (chart?.data ?? []).map((series) => series.metric),
    [chart]
  );

  const visibleSources = useMemo(
    () => metrics.filter((metric) => !hiddenSources.includes(metric)),
    [metrics, hiddenSources]
  );

  const hasForecastData = useMemo(
    () =>
      chart?.data.some((series) =>
        series.current_series.some((point) => point.is_forecast)
      ) ?? false,
    [chart]
  );

  const lines = useMemo(() => {
    const series = (chart?.data ?? []).filter(
      (item) => !hiddenSources.includes(item.metric)
    );
    return buildDrugChartLines(series, {
      showForecast: showForecast && hasForecastData,
      includeStly: effectiveStly,
    });
  }, [chart, hiddenSources, showForecast, hasForecastData, effectiveStly]);

  const metricOptions = useMemo(
    () => metrics.map((metric) => ({ label: metric, value: metric })),
    [metrics]
  );

  const isInitialLoading = (isConfigLoading || isChartLoading) && !chart;

  const hasRenderableLines = lines.some(
    (line) =>
      line.actual.length > 0 ||
      line.forecast.length > 0 ||
      line.prior.length > 0
  );

  const templates = config?.metadata.templates ?? [];
  const templateLabelMap =
    config?.metadata.template_label_map ?? FALLBACK_TEMPLATE_LABEL_MAP;
  const cardTitle = `${templateLabelMap[selectedTemplate] ?? selectedTemplate} Trend`;

  const actions = (
    <div className="ml-auto flex flex-wrap items-center gap-4">
      {templates.length > 1 && (
        <ToggleGroup
          type="single"
          value={selectedTemplate}
          onValueChange={(value) => {
            if (value) onTemplateChange(value);
          }}
        >
          {templates.map((t) => (
            <ToggleGroupItem key={t} value={t}>
              {templateLabelMap[t] ?? t}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}
      <BadgeMultiSelect
        placeholder="Sources"
        alwaysShowPlaceholder
        options={metricOptions}
        value={visibleSources}
        onChange={(values) => {
          const selected = values as string[];
          setHiddenSources(
            metrics.filter((metric) => !selected.includes(metric))
          );
        }}
        isResetOnRemove={false}
        handleSelectAll={() => setHiddenSources([])}
        handleDeselectAll={() => setHiddenSources(metrics)}
        testId="paid-trx-sources-select"
      />
      <LabeledCheckbox
        label="Forecast"
        checked={showForecast && hasForecastData}
        disabled={!hasForecastData}
        onChange={setShowForecast}
        testId="paid-trx-forecast-toggle"
      />
      <LabeledCheckbox
        label="Same time last year"
        checked={effectiveStly}
        disabled={!stlyAllowed}
        onChange={setIncludeStly}
        testId="paid-trx-stly-toggle"
      />
      <div className="flex flex-wrap items-center gap-2">
        <ToggleGroup
          type="single"
          value={period}
          onValueChange={handlePeriodChange}
        >
          {periods.map((value) => (
            <ToggleGroupItem key={value} value={value}>
              {periodLabel(value)}
            </ToggleGroupItem>
          ))}
          {!periods.includes(CUSTOM_PERIOD) && (
            <ToggleGroupItem value={CUSTOM_PERIOD}>Custom</ToggleGroupItem>
          )}
        </ToggleGroup>
        {isCustom && (
          <DateRangeSinglePicker date={customRange} setDate={setCustomRange} />
        )}
      </div>
    </div>
  );

  return (
    <Card title={cardTitle} className="min-h-[24rem]" actions={actions}>
      {isCustom && !customRangeReady ? (
        <div className="flex flex-1 items-center justify-center text-sm text-neutral-400">
          Select a date range to load data.
        </div>
      ) : isInitialLoading ? (
        <div className="flex flex-1 flex-col gap-4 pt-4">
          <Skeleton className="h-full w-full flex-1" />
        </div>
      ) : !hasRenderableLines ? (
        <div className="flex flex-1 items-center justify-center text-sm text-neutral-400">
          No Paid TRx data available for this selection.
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-3">
          <div className="relative min-h-0 flex-1">
            {isChartFetching && (
              <span className="absolute right-2 top-2 z-10 text-xs text-neutral-500">
                Updating…
              </span>
            )}
            <ErrorBoundary
              key={JSON.stringify(request)}
              fallback={(errorMessage) => (
                <ErrorOverlay description={errorMessage} />
              )}
            >
              <DrugTrxChart
                lines={lines}
                highlightedSource={highlightedSource}
              />
            </ErrorBoundary>
          </div>
          <TrxChartLegend
            lines={lines}
            showForecast={showForecast && hasForecastData}
            showPrior={effectiveStly}
            highlightedSource={highlightedSource}
          />
        </div>
      )}
    </Card>
  );
};
