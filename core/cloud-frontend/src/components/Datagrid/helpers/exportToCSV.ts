import { RefObject } from "react";
import { ColDef, Column, GridApi, IRowNode } from "@ag-grid-community/core";
import { toast } from "@/components/ui/use-toast";
import { ProbabilitiesToDisplayStrings } from "@/typings/Probabilities";

export const exportDatagridToCSV = (
  gridRef: RefObject<GridApi | null>,
  name: string,
  autoGroupedColumns?: string[]
) => {
  const gridApi = gridRef.current;
  if (!gridApi) {
    showToast(
      "Can't Export to CSV",
      "Please ensure there is data in the table before exporting!"
    );
    return;
  }

  try {
    const allDisplayedColumns = getDisplayedColumns(gridApi);
    if (allDisplayedColumns.length === 0) {
      showToast(
        "Can't Export to CSV",
        "Please ensure there is data in the table before exporting!"
      );
      return;
    }

    const { groupColumn, valueColumns } = separateColumns(allDisplayedColumns);
    const data = groupColumn
      ? extractGroupedData(
          gridApi,
          valueColumns,
          groupColumn,
          autoGroupedColumns
        )
      : extractRegularData(gridApi);
    const csvData = convertToCSV(data);
    downloadCSV(csvData, name || "Export");
  } catch (error) {
    handleExportError(error);
  }
};

export const exportMultipleDatagridsToCSV = (
  gridRefFirst: RefObject<GridApi | null>,
  gridRefSecond: RefObject<GridApi | null>,
  name: string,
  firstSheetName?: string,
  secondSheetName?: string
) => {
  if (!gridRefFirst.current || !gridRefSecond.current) {
    showToast(
      "Can't Export to CSV",
      "Please ensure there is data in both tables before exporting!"
    );
    return;
  }

  try {
    const csvDataFirst = processGridForCSV(gridRefFirst.current);
    const csvDataSecond = processGridForCSV(gridRefSecond.current);
    const combinedCSVData = combineCSVData(
      csvDataFirst,
      csvDataSecond,
      firstSheetName || `${name} 1`,
      secondSheetName || `${name} 2`
    );
    downloadCSV(combinedCSVData, name);
  } catch (error) {
    handleExportError(error);
  }
};

const getDisplayedColumns = (gridApi: GridApi): Column[] => {
  if (typeof gridApi.getAllDisplayedColumns !== "function") {
    throw new Error("getAllDisplayedColumns is not a function");
  }
  return gridApi.getAllDisplayedColumns() || [];
};

const separateColumns = (columns: Column[]) => {
  const groupColumn = columns.find(
    (col) => col.getColId() === "ag-Grid-AutoColumn"
  );
  const valueColumns = columns.filter(
    (col) => col.getColId() !== "ag-Grid-AutoColumn"
  );
  return { groupColumn, valueColumns };
};

const processGridForCSV = (gridApi: GridApi): string => {
  const allDisplayedColumns = getDisplayedColumns(gridApi);
  if (allDisplayedColumns.length === 0) {
    throw new Error("No columns to export");
  }

  const { groupColumn, valueColumns } = separateColumns(allDisplayedColumns);
  const data = groupColumn
    ? extractGroupedData(gridApi, valueColumns, groupColumn)
    : extractRegularData(gridApi);
  return convertToCSV(data);
};

const combineCSVData = (
  csvDataFirst: string,
  csvDataSecond: string,
  firstSheetName: string,
  secondSheetName: string
): string => {
  return `Sheet: ${firstSheetName}\n${csvDataFirst}\n\nSheet: ${secondSheetName}\n${csvDataSecond}`;
};

const convertToCSV = (data: Record<string, string | number>[]): string => {
  if (data.length === 0) return "";

  const headers = Array.from(new Set(data.flatMap(Object.keys)));
  const csvRows = data.map((row) =>
    headers.map((header) => JSON.stringify(row[header] || "")).join(",")
  );

  return [headers.join(","), ...csvRows].join("\n");
};

const downloadCSV = (csvData: string, fileName: string) => {
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${fileName}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const extractGroupedData = (
  gridApi: GridApi,
  valueColumns: Column[],
  groupColumn?: Column,
  autoGroupedColumns?: string[]
): Record<string, string | number>[] => {
  const exportData: Record<string, string | number>[] = [];
  const groupHeaderName = groupColumn?.getColDef().headerName || "Group";

  const processNodeRecursively = (node: IRowNode, path: string[] = []) => {
    if (node.group && node.childrenAfterGroup) {
      node.childrenAfterGroup.forEach((childNode) => {
        processNodeRecursively(childNode, [...path, node.key || ""]);
      });
    } else if (!node.group) {
      const fullPath = [...path, node.key || ""];
      const row: Record<string, string | number> = {};

      const groupLevelNames =
        autoGroupedColumns && autoGroupedColumns.length > 0
          ? autoGroupedColumns
          : groupHeaderName === "Name"
            ? ["Group", "Name", "Level 3"]
            : [groupHeaderName, "Name", "Level 3"];

      fullPath.forEach((value, index) => {
        if (index < groupLevelNames.length) {
          row[groupLevelNames[index]] = value;
        } else {
          row[`Level ${index + 1}`] = value;
        }
      });

      valueColumns.forEach((col) => {
        const colId = col.getColId();
        const header = col.getColDef().headerName || colId;
        let cellValue =
          gridApi.getCellValue({
            colKey: colId,
            rowNode: node,
          }) || "";

        if (typeof cellValue === "string" && cellValue.includes("|")) {
          const parts = cellValue.split("|");
          cellValue = parts.slice(1).join(" ");
        } else if (
          typeof cellValue === "string" &&
          cellValue.toString().startsWith("band_")
        ) {
          cellValue =
            ProbabilitiesToDisplayStrings[cellValue.toUpperCase()] || cellValue;
        }

        row[header] = cellValue;
      });

      exportData.push(row);
    }
  };

  gridApi.forEachNode((node) => {
    if (node.level === 0 && node.group) {
      processNodeRecursively(node, []);
    }
  });

  return exportData;
};

const extractRegularData = (
  gridApi: GridApi
): Record<string, string | number>[] => {
  const rowData: Record<string, string | number>[] = [];
  const columnDefs = gridApi.getColumnDefs() as ColDef[];

  if (!columnDefs) return rowData;

  const visibleColumns = columnDefs.filter((col) => !col.hide);

  gridApi.forEachNode((node) => {
    if (!node.data) return;

    const rowItem: Record<string, string | number> = {};
    visibleColumns.forEach((col) => {
      const field = col.field;
      const headerName = col.headerName || field || "";
      if (field && node.data[field] !== undefined) {
        const value = node.data[field];
        if (typeof value === "string" && value.includes("|")) {
          const parts = value.split("|");
          rowItem[headerName] = parts.slice(1).join(" ");
        } else if (
          typeof value === "string" &&
          value.toString().startsWith("band_")
        ) {
          rowItem[headerName] =
            ProbabilitiesToDisplayStrings[value.toUpperCase()] || value;
        } else {
          rowItem[headerName] = value;
        }
      }
    });

    rowData.push(rowItem);
  });

  return rowData;
};

const showToast = (title: string, description: string) => {
  toast({
    title,
    description,
    variant: "destructive",
  });
};

const handleExportError = (error: unknown) => {
  console.error("Export to CSV error:", error);
  showToast(
    "Can't Export to CSV",
    "There was an error exporting the data. Please try again later."
  );
};
