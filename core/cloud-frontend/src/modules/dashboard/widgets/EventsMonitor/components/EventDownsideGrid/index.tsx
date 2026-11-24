import { CompanyEventEstimateResponse, MetricDisplayType } from "@/api/types";
import {
  InfoGrid,
  InfoGridCell,
  InfoGridCellLabel,
  InfoGridCellValue,
} from "../InfoGrid";
import { ProbabilitiesToDisplayStrings } from "@/typings/Probabilities";
import { formatMetric } from "@/utils/metrics";

export interface EventDownsideGridProps {
  data: CompanyEventEstimateResponse;
}

export const EventDownsideGrid = ({ data }: EventDownsideGridProps) => {
  return (
    <InfoGrid className="grid-cols-2">
      <div className="text-red-400 font-medium md:hidden">Downside</div>

      <InfoGridCell>
        <InfoGridCellLabel>Probability</InfoGridCellLabel>
        <InfoGridCellValue className="text-red-500">
          {ProbabilitiesToDisplayStrings[data.downside_probability]}
        </InfoGridCellValue>
      </InfoGridCell>

      <InfoGridCell>
        <InfoGridCellLabel>Downside</InfoGridCellLabel>
        <InfoGridCellValue className="text-red-500">
          {formatMetric(
            data.latest_downside_percentage,
            MetricDisplayType.percent
          ) ?? "-"}
        </InfoGridCellValue>
      </InfoGridCell>
    </InfoGrid>
  );
};
