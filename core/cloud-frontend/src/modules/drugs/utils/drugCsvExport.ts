import ExcelJS from "exceljs";

import type { MetricSeries, VendorEstimatesResponse } from "@api/types";

type Cell = string | number | null | undefined;
type Grid = Cell[][];

/** Prefixed to the file so Excel reads non-ASCII drug/source names correctly. */
const UTF8_BOM = String.fromCharCode(0xfeff);

/** RFC-4180 cell escaping: quote when the value contains a comma, quote, or newline. */
const formatCell = (cell: Cell): string => {
  if (cell === null || cell === undefined) return "";
  if (typeof cell === "number")
    return Number.isFinite(cell) ? String(cell) : "";
  return /[",\r\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
};

const serializeGrid = (grid: Grid): string =>
  grid.map((row) => row.map(formatCell).join(",")).join("\r\n");

/**
 * Long (tidy) matrix of the Paid TRx trend: one row per week × metric
 * combination. Easier to pivot/filter in Excel than the wide format.
 */
export const buildChartGrid = (series: MetricSeries[]): Grid => {
  const header: Cell[] = ["Week", "Metric", "Value", "Is Forecast"];
  const rows: Grid = [];

  series.forEach((item) => {
    [...item.current_series]
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach((point) => {
        rows.push([
          point.date,
          item.metric,
          point.value ?? null,
          point.is_forecast ? "TRUE" : "FALSE",
        ]);
      });
  });

  return [header, ...rows];
};

/** Vendor estimates table, with the mean-consensus row appended when present. */
export const buildVendorEstimatesGrid = (
  data?: VendorEstimatesResponse | null
): Grid => {
  const header: Cell[] = [
    "Source",
    "Qtr Estimate (M$)",
    "Surprise (%)",
    "4Yr Estimate (M$)",
    "4Yr Surprise (%)",
  ];

  const rows: Grid = (data?.estimates ?? []).map((row) => [
    row.source_kpi,
    row.qtr_estimate_usd_m,
    row.qtr_surprise_pct,
    row.y4_estimate_usd_m,
    row.y4_surprise_pct,
  ]);

  if (data?.consensus) {
    rows.push([
      "Mean Consensus",
      data.consensus.qtr_estimate_usd_m,
      null,
      data.consensus.y4_estimate_usd_m,
      null,
    ]);
  }

  return [header, ...rows];
};

const sanitizeFilename = (name: string): string =>
  name
    .trim()
    .replace(/[^\w.-]+/g, "_")
    .replace(/^_+|_+$/g, "") || "drug";

const downloadCsv = (filename: string, grid: Grid): void => {
  const blob = new Blob([UTF8_BOM, "sep=,\r\n", serializeGrid(grid)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

/** Download the Paid TRx trend chart data as a single-sheet CSV. */
export const exportDrugChartCsv = (
  drugName: string,
  series: MetricSeries[]
): void =>
  downloadCsv(
    `${sanitizeFilename(drugName)}_paid_trx.csv`,
    buildChartGrid(series)
  );

const addGridToSheet = (sheet: ExcelJS.Worksheet, grid: Grid): void => {
  grid.forEach((row) => sheet.addRow(row));
  sheet.getRow(1).font = { bold: true };
  sheet.columns.forEach((column) => {
    column.width = 18;
  });
};

const downloadXlsx = async (filename: string, buffer: ArrayBuffer) => {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

/**
 * Download the full Drug Detail page: the Paid TRx chart data and the vendor
 * estimates table as two sheets in a single workbook.
 */
export const exportDrugPageXlsx = async (
  drugName: string,
  series: MetricSeries[],
  estimates?: VendorEstimatesResponse | null
): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  addGridToSheet(workbook.addWorksheet("Paid TRx"), buildChartGrid(series));
  addGridToSheet(
    workbook.addWorksheet("Vendor Estimates"),
    buildVendorEstimatesGrid(estimates)
  );

  const buffer = await workbook.xlsx.writeBuffer();
  await downloadXlsx(`${sanitizeFilename(drugName)}.xlsx`, buffer);
};
