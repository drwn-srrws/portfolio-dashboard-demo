import { Icon, IconProps } from "@/components/Icon/Icon";
import { Button, Textarea } from "@components/ui";
import clsx from "clsx";
import { useState } from "react";
import { parseISO, format, differenceInDays } from "date-fns";
import { GetRating } from "../../types/RatingTypes";

export interface RatingFormProps {
  disableTicker?: boolean;
  tickerName?: string;
  deadlineDate: string | null;
  ratingSource: GetRating | undefined;
  onClose: () => void;
  onUpdateRating: (rating: GetRating) => void;
}

export const RatingForm = ({
  disableTicker,
  tickerName,
  deadlineDate,
  ratingSource,
  onClose,
  onUpdateRating,
}: RatingFormProps) => {
  // const today = new Date().toISOString().split("T")[0];

  const defaultRatingValue =
    ratingSource && ratingSource.rating_value != null
      ? ratingSource.rating_value.toString()
      : "";

  const defaultComment = ratingSource?.comment ?? "";

  const [selectedRating, setSelectedRating] = useState<string | null>(
    defaultRatingValue
  );
  const [comment, setComment] = useState<string>(defaultComment);

  const handleChangeRatingValue = (value: string) => setSelectedRating(value);

  const handleChangeComment = (comment: string) => setComment(comment);

  const handleApply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedRating) return;

    const rating: GetRating = {
      analyst_id: ratingSource?.analyst_id ?? 0,
      instrument_id: ratingSource?.instrument_id ?? 0,
      analyst_name: ratingSource?.analyst_name ?? "",
      instrument_ticker: ratingSource?.instrument_ticker ?? "",
      rating_name: "",
      rating_value: Number(selectedRating),
      subsector: ratingSource?.subsector ?? "",
      idea_tracker_outdated_ratings:
        ratingSource?.idea_tracker_outdated_ratings ?? 0,
      comment,
      idea_tracker_rating_last_updated:
        ratingSource?.idea_tracker_rating_last_updated ?? "",
      rating_date: ratingSource?.rating_date ?? "",
    };

    onUpdateRating(rating);
    onClose();
  };

  return (
    <form className="flex flex-col gap-5 p-4" onSubmit={handleApply}>
      <h4 className="text-xl font-medium leading-4">Ratings</h4>
      <div>
        {!disableTicker && (
          <div className="text-base text-neutral-400">
            Ticker: <b>{tickerName}</b>
          </div>
        )}
        {ratingSource && (
          <>
            <div className="text-base text-neutral-400">
              Last rating: <b>{ratingSource.rating_name}</b>
            </div>
            <div className="text-base text-neutral-400 flex items-center gap-1">
              Last updated:{" "}
              {ratingSource.idea_tracker_rating_last_updated
                ? format(
                    parseISO(ratingSource.idea_tracker_rating_last_updated),
                    "MM/dd/yyyy"
                  )
                : "-"}
              {ratingSource.idea_tracker_rating_last_updated && (
                <span className="text-sm text-neutral-400">
                  (
                  {differenceInDays(
                    new Date(),
                    parseISO(ratingSource.idea_tracker_rating_last_updated)
                  )}{" "}
                  days ago)
                </span>
              )}
            </div>
          </>
        )}
        <div className="text-base text-neutral-400">
          Submission date: {deadlineDate}
        </div>
      </div>
      <div className="flex gap-2">
        {ratings.map(({ icon, text, value }) => (
          <Button
            key={text}
            data-testid={`idea-portfolio-table-edit-rating-${value}`}
            variant="ghost"
            type="button"
            className={clsx(
              "flex items-center gap-[5px] rounded-[8px] border border-neutral-700 p-[10px] pl-[6px]",
              {
                "bg-neutral-700":
                  selectedRating?.toString() === value.toString(),
              }
            )}
            onClick={() => handleChangeRatingValue(value.toString())}
          >
            <Icon {...icon} className="size-5" />
            <span className="text-sm">{text}</span>
          </Button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-base font-medium leading-4">Add Comment</span>
        <div className="relative h-[102px]">
          <Textarea
            data-testid="idea-portfolio-table-edit-rating-comment-textarea"
            placeholder="Description about the rating change"
            className="h-full resize-none"
            value={comment}
            maxLength={255}
            onChange={(e) => handleChangeComment(e.target.value)}
          />
          <div className="absolute bottom-2 right-2 text-xs text-neutral-400">
            {comment.length}/255
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="bg-neutral-600 text-foreground hover:bg-neutral-600/80"
          type="submit"
          data-testid="idea-portfolio-table-edit-rating-apply-button"
        >
          {selectedRating === defaultRatingValue ? "Reaffirm" : "Update"}
        </Button>
      </div>
    </form>
  );
};

const ratings: {
  icon: IconProps;
  text: string;
  value: string;
}[] = [
  {
    icon: {
      color: "#2EAE5C",
      name: "ChevronsUp",
      size: "lg",
    },

    text: "Large Buy",
    value: "2",
  },
  {
    icon: {
      color: "#2EAE5C",
      name: "ChevronUp",
      size: "lg",
    },
    text: "Small Buy",
    value: "1",
  },
  {
    icon: {
      color: "#A3A3A3",
      name: "CircleMinus",
      size: "lg",
    },
    text: "Neutral",
    value: "0",
  },
  {
    icon: {
      color: "#E8525F",
      name: "ChevronDown",
      size: "lg",
    },
    text: "Small Sell",
    value: "-1",
  },
  {
    icon: {
      color: "#E8525F",
      name: "ChevronsDown",
      size: "lg",
    },
    text: "Large Sell",
    value: "-2",
  },
];
