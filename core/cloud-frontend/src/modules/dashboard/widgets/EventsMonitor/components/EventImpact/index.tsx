import {
  InfoGrid,
  InfoGridCell,
  InfoGridCellLabel,
  InfoGridCellValue,
} from "../InfoGrid";

export interface EventImpactProps {
  anticipatedImpact?: string;
  actualImpact?: string;
}

export const EventImpact = ({
  anticipatedImpact,
  actualImpact,
}: EventImpactProps) => {
  return (
    <>
      <div className="md:hidden">
        <InfoGrid>
          {anticipatedImpact && (
            <InfoGridCell>
              <InfoGridCellLabel>Classification</InfoGridCellLabel>
              <InfoGridCellValue>{anticipatedImpact}</InfoGridCellValue>
            </InfoGridCell>
          )}
          {actualImpact && (
            <InfoGridCell>
              <InfoGridCellLabel>Impact</InfoGridCellLabel>
              <InfoGridCellValue>{actualImpact}</InfoGridCellValue>
            </InfoGridCell>
          )}
        </InfoGrid>
      </div>

      <div className="hidden md:flex md:flex-col md:gap-1">
        {anticipatedImpact && (
          <span>
            <b>Event Classification:</b> {anticipatedImpact}
          </span>
        )}

        {actualImpact && (
          <span>
            <b>Event Impact:</b> {actualImpact}
          </span>
        )}
      </div>
    </>
  );
};
