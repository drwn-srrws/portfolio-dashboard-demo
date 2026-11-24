import { TreemapNode } from "./index";

type FlatTreemapItem = TreemapNode & {
  valueLabel: string;
};

export const exportTreemapToCSV = (
  card_name: string,
  data: FlatTreemapItem[]
) => {
  const firstMetric = data[0]?.valueLabel || "Value";

  const rows = [
    ["Name", firstMetric],
    ...data.map((item) => {
      return [
        `"${item.name?.toString() || ""}"`,
        item.value != null ? item.value.toString() : null,
      ];
    }),
  ];

  const csvContent = rows.map((e) => e.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const sanitizedName = card_name.replace(/[\\/:*?"<>|]/g, "_");
  link.setAttribute("href", URL.createObjectURL(blob));
  link.setAttribute("download", `${sanitizedName}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
