export const MetricChartOverlay = () => (
  <>
    <div
      className="absolute top-0 left-0 w-full bg-neutral-900 h-[4px] z-10 overflow-hidden"
      data-testid="metric-chart-loader"
    >
      <div className="absolute top-0 left-0 w-[150px] h-full bg-white/50 animate-[loader-animation_8s_infinite_linear] z-10" />
    </div>
    <div className="absolute inset-0 bg-black/30" />
  </>
);
