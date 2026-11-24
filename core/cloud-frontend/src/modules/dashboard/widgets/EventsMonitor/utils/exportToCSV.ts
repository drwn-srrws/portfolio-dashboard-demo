import { RefObject } from "react";
import { GridApi } from "@ag-grid-community/core";
import { CompanyResponse, MetricDisplayType } from "@/api/types";
import { formatMetric } from "@/utils/metrics";
import { ProbabilitiesToDisplayStrings } from "@/typings/Probabilities";
import { toast } from "@/components/ui/use-toast";
import { hyphenatedDate } from "@/utils/dates";

export const exportEventsMonitorToCSV = (
  gridRef: RefObject<GridApi | null>,
  companies: CompanyResponse[],
  name: string
) => {
  if (!gridRef.current || !companies.length) {
    toast({
      title: "Can't Export to CSV",
      description: "Please ensure there is data in the table before exporting!",
      variant: "destructive",
    });
    return;
  }

  try {
    const csvRows: Record<string, string | number>[] = companies.flatMap(
      (company) => {
        const allFundData = company.position_exposure_by_funds?.find(
          (item) => item.fund.name === "All" || item.fund.id === -1
        );
        const size = formatMetric(
          allFundData?.exposure,
          MetricDisplayType.percent
        );
        const securityCode = company.primary_instrument?.security_code || "";

        return (
          company.events?.map((event, index) => {
            const estimate = event.estimate;
            const isFirstEvent = index === 0;
            const estimateCount = event.estimates?.length || 0;

            return {
              "Security Code": isFirstEvent ? securityCode : "",
              Size: isFirstEvent ? size : "",
              Event: event.name || "",
              "Event Type": event.event_type?.name || "",
              Classification: event.anticipated_impact?.name || "",
              Timing: event.date ? hyphenatedDate(new Date(event.date)) : "",
              "# of Estimates": estimateCount,
              POS: estimate?.upside_probability
                ? ProbabilitiesToDisplayStrings[estimate.upside_probability] ||
                  estimate.upside_probability
                : "",
              "Upside Notes": estimate?.upside_notes || "",
              "Downside Notes": estimate?.downside_notes || "",
              "Up %": estimate?.upside_percentage
                ? `${estimate.upside_percentage}%`
                : "",
              "Down %": estimate?.downside_percentage
                ? `${estimate.downside_percentage}%`
                : "",
              Workstream: event.workstream_description || "",
            };
          }) || []
        );
      }
    );

    if (csvRows.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no events with estimates to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = Object.keys(csvRows[0]);
    const csvContent = [
      headers.join(","),
      ...csvRows.map((row) =>
        headers.map((header) => JSON.stringify(row[header] || "")).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${name}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Export to CSV error:", error);
    toast({
      title: "Can't Export to CSV",
      description:
        "There was an error exporting the data. Please try again later.",
      variant: "destructive",
    });
  }
};
