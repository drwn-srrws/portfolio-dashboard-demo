import { ReactNode } from "react";

import { roundDaysUntilEvent } from "@/utils";
import {
  InfoGrid,
  InfoGridCell,
  InfoGridCellLabel,
  InfoGridCellValue,
} from "../InfoGrid";

export interface EventOverviewGridProps {
  name: string;
  type: string;
  date: ReactNode;
  timeUntil: Date | null;
}

export const EventOverviewGrid = ({
  name,
  type,
  date,
  timeUntil,
}: EventOverviewGridProps) => {
  return (
    <InfoGrid>
      <div className="font-bold text-sm break-words md:hidden">{name}</div>

      <InfoGridCell>
        <InfoGridCellLabel>Name</InfoGridCellLabel>
        <InfoGridCellValue>{name}</InfoGridCellValue>
      </InfoGridCell>

      <InfoGridCell>
        <InfoGridCellLabel>Type</InfoGridCellLabel>
        <InfoGridCellValue>{type}</InfoGridCellValue>
      </InfoGridCell>

      <InfoGridCell>
        <InfoGridCellLabel>Event date</InfoGridCellLabel>
        <InfoGridCellValue>{date}</InfoGridCellValue>
      </InfoGridCell>

      <InfoGridCell>
        <InfoGridCellLabel>Time until</InfoGridCellLabel>
        {timeUntil && (
          <InfoGridCellValue>
            {roundDaysUntilEvent(timeUntil)}
          </InfoGridCellValue>
        )}
      </InfoGridCell>
    </InfoGrid>
  );
};
