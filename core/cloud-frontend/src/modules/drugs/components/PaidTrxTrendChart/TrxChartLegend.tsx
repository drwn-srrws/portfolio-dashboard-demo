interface TrxChartLegendProps {
  lines: { id: string; name: string; color: string }[];
  showForecast: boolean;
  showPrior: boolean;
  highlightedSource?: string | null;
}

export const TrxChartLegend = ({
  lines,
  showForecast,
  showPrior,
  highlightedSource,
}: TrxChartLegendProps) => {
  const highlightActive =
    !!highlightedSource && lines.some((line) => line.id === highlightedSource);

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-300">
      {lines.map((line) => (
        <span
          key={line.id}
          className="flex items-center gap-2 transition-opacity"
          style={{
            opacity: highlightActive && line.id !== highlightedSource ? 0.3 : 1,
          }}
        >
          <span
            className="inline-block h-0.5 w-4"
            style={{ backgroundColor: line.color }}
          />
          {line.name}
        </span>
      ))}
      {showForecast && (
        <span className="flex items-center gap-2 text-neutral-400">
          <span className="inline-block w-4 border-t-2 border-dashed border-neutral-400" />
          Forecast
        </span>
      )}
      {showPrior && (
        <span className="flex items-center gap-2 text-neutral-400">
          <span className="inline-block w-4 border-t-2 border-dotted border-neutral-400" />
          Same time last year
        </span>
      )}
    </div>
  );
};
