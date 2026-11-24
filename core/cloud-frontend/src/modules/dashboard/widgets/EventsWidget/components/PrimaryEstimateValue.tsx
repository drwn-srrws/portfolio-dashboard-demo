export interface PrimaryEstimateValueProps {
  primaryValue: unknown;
  formattedValue: string;
  hasOtherEstimates: boolean;
}

export const PrimaryEstimateValue = ({
  primaryValue,
  formattedValue,
  hasOtherEstimates,
}: PrimaryEstimateValueProps) => {
  if (primaryValue == null && hasOtherEstimates) {
    return (
      <span className="text-neutral-500 text-xs cursor-default select-none whitespace-nowrap">
        No primary
      </span>
    );
  }
  return <span>{formattedValue}</span>;
};
