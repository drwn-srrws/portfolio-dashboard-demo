import { CompanyEventEstimateResponse, MetricDisplayType } from "@/api/types";
import {
  InfoGrid,
  InfoGridCell,
  InfoGridCellLabel,
  InfoGridCellValue,
} from "../InfoGrid";
import { ProbabilitiesToDisplayStrings } from "@/typings/Probabilities";
import { formatMetric } from "@/utils/metrics";

export interface EventUpsideGridProps {
  data: CompanyEventEstimateResponse;
}

export const EventUpsideGrid = ({ data }: EventUpsideGridProps) => {
  return (
    <InfoGrid className="grid-cols-2">
      <div className="text-green-400 font-medium md:hidden">Upside</div>

      <InfoGridCell>
        <InfoGridCellLabel>Probability</InfoGridCellLabel>
        <InfoGridCellValue className="text-green-500">
          {ProbabilitiesToDisplayStrings[data.upside_probability]}
        </InfoGridCellValue>
      </InfoGridCell>

      <InfoGridCell>
        <InfoGridCellLabel>Upside</InfoGridCellLabel>
        <InfoGridCellValue className="text-green-500">
          {formatMetric(
            data.latest_upside_percentage,
            MetricDisplayType.percent
          ) ?? "-"}
        </InfoGridCellValue>
      </InfoGridCell>
    </InfoGrid>
  );
};
