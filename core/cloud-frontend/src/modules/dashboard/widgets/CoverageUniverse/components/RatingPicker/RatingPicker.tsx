import { CompanyRatingType } from "@api/types";
import { cn } from "@/utils";
import { Icon } from "@components/Icon/Icon";
import { Button } from "@components/ui";
import { FormControl, FormControlProps } from "@components/Form/FormControl";
import { ratings } from "../../constants/ratings";

export interface RatingPickerProps extends FormControlProps {
  value: CompanyRatingType | null;
  onChange: (rating: CompanyRatingType) => void;
}

export const RatingPicker = ({
  value,
  onChange,
  ...props
}: RatingPickerProps) => (
  <FormControl {...props}>
    <div className="flex gap-2">
      {ratings.map((rating) => (
        <Button
          key={rating.value}
          variant="ghost"
          type="button"
          data-testid={`rating-picker-${rating.value}`}
          className={cn(
            "flex items-center gap-[5px] rounded-[8px] border border-neutral-700 p-[10px] pl-[6px]",
            value === rating.value && "bg-neutral-700"
          )}
          onClick={() => onChange(rating.value)}
        >
          <Icon
            name={rating.icon}
            size="lg"
            color={rating.color}
            className="size-5"
          />
          <span className="text-sm">{rating.text}</span>
        </Button>
      ))}
    </div>
  </FormControl>
);
