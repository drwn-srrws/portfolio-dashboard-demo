export interface Coords {
  x: number;
  y: number;
}

export interface TooltipData {
  date: string;
  periodEnding: string;
  earnings: {
    standardized: string;
    reported: string;
    estimate: string;
    surprise: string;
  };
  revenue: {
    reported: string;
    estimate: string;
    surprise: string;
  };
}

export interface ChartTooltipProps {
  title: string;
  coords: Coords;
  offset: string;
  tooltipData: TooltipData;
  borderColor: string;
}

export const ChartTooltip = ({
  coords,
  title,
  offset,
  tooltipData,
  borderColor,
}: ChartTooltipProps) => (
  <div
    className="absolute z-10 w-64 rounded border-l-4 bg-white p-4 shadow-md"
    style={{
      left: coords.x,
      top: coords.y,
      marginTop: offset,
      borderColor,
      transform: "translate(-50%, 0)",
      pointerEvents: "none",
    }}
  >
    <h1 className="mb-4 text-lg font-medium">{title}</h1>

    <div className="mb-4 flex flex-col">
      <div className="flex justify-between">
        <span>Date</span>
        <span>{tooltipData.date}</span>
      </div>
      <div className="flex justify-between">
        <span>Period Ending</span>
        <span>{tooltipData.periodEnding}</span>
      </div>
    </div>

    <div className="mb-4 flex flex-col">
      <span className="text-gray-500">Earnings</span>
      <div className="flex justify-between">
        <span>Standardized</span>
        <span>{tooltipData.earnings.standardized}</span>
      </div>
      <div className="flex justify-between">
        <span>Reported</span>
        <span>{tooltipData.earnings.reported}</span>
      </div>
      <div className="flex justify-between">
        <span>Estimate</span>
        <span>{tooltipData.earnings.estimate}</span>
      </div>
      <div className="flex justify-between">
        <span>Surprise</span>
        <span>{tooltipData.earnings.surprise}</span>
      </div>
    </div>

    <div className="mb-4 flex flex-col">
      <span className="text-gray-500">Revenue</span>
      <div className="flex justify-between">
        <span>Reported</span>
        <span>{tooltipData.revenue.reported}</span>
      </div>
      <div className="flex justify-between">
        <span>Estimate</span>
        <span>{tooltipData.revenue.estimate}</span>
      </div>
      <div className="flex justify-between">
        <span>Surprise</span>
        <span>{tooltipData.revenue.surprise}</span>
      </div>
    </div>
  </div>
);
