import { toast } from "@/components/ui/use-toast";

export const thresholds = [
  { width: 1920, maxItems: 25 },
  { width: 1536, maxItems: 20 },
  { width: 900, maxItems: 15 },
  { width: 500, maxItems: 10 },
  { width: 0, maxItems: 5 },
];

type TimeSeriesPoint = {
  time: string;
  value: number;
};

export type TimeSeries = {
  name: string;
  data: TimeSeriesPoint[];
};

export const exportTimeSeriesToCSV = (
  cardName: string,
  series: TimeSeries[]
) => {
  if (series.length === 0) {
    toast({
      title: "Can't Export to CSV",
      description: "No time series data available for export!",
      variant: "destructive",
    });
    return;
  }

  const dateMap = series.reduce(
    (acc, { name, data }) =>
      data.reduce(
        (map, { time, value }) => ({
          ...map,
          [time]: {
            ...(map[time] ?? { Date: time }),
            [name]: value,
          },
        }),
        acc
      ),
    {} as Record<string, { Date: string; [key: string]: string | number }>
  );

  const sortedRows = Object.values(dateMap).sort((a, b) =>
    a.Date.localeCompare(b.Date)
  );

  const headers = ["Date", ...series.map(({ name }) => name)];
  const csvContent = [
    headers.join(","),
    ...sortedRows.map((row) =>
      headers.map((header) => JSON.stringify(row[header] ?? "")).join(",")
    ),
  ].join("\n");

  const sanitizedName = cardName.replace(/[\\/:*?"<>|]/g, "_").slice(0, 31);

  try {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${sanitizedName}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Export to CSV error:", error);
    toast({
      title: "Can't Export to CSV",
      description:
        "There was an error exporting the time series data. Please try again later.",
      variant: "destructive",
    });
  }
};
