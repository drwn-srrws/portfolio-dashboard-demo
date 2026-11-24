import {
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
  ChevronUp,
  CircleMinus,
} from "lucide-react";

import { Tooltip } from "@components/Tooltip/Tooltip";
import { RATING } from "./Rating.types";
import { GetRating } from "../../../types/RatingTypes";

export interface RatingProps {
  rating: RATING;
  ratingSource: GetRating;
  testId?: string;
}

export const Rating = ({ rating, ratingSource, testId }: RatingProps) => {
  const getRatingStyle = (rating: RATING) => {
    switch (rating) {
      case RATING.LARGE_BUY:
        return {
          color: "text-green-100",
          icon: <ChevronsUp color="currentColor" className="size-5" />,
        };
      case RATING.BUY:
        return {
          color: "text-[#b9f1c1]",
          icon: <ChevronUp color="currentColor" className="size-5" />,
        };
      case RATING.LARGE_SELL:
        return {
          color: "text-red-100",
          icon: <ChevronsDown color="currentColor" className="size-5" />,
        };
      case RATING.NEUTRAL:
        return {
          color: "text-gray-400",
          icon: <CircleMinus color="currentColor" className="size-5" />,
        };
      case RATING.SELL:
        return {
          color: "text-[#faa0a0]",
          icon: <ChevronDown color="currentColor" className="size-5" />,
        };
      default:
        return { color: "black", icon: "" };
    }
  };

  const { color, icon } = getRatingStyle(rating);
  if (ratingSource) {
    return (
      <Tooltip
        trigger={
          <div
            className={`flex items-center gap-2 ${color}`}
            data-testid={testId}
          >
            {icon} {rating}
          </div>
        }
        content={
          <div className="m-0 flex flex-col gap-2 rounded-md p-[3px] text-white">
            <p className="text-base">{ratingSource.rating_name}</p>
            {ratingSource.comment && (
              <p className="text-sm">{ratingSource.comment}</p>
            )}
            <p className="text-sm text-neutral-400">
              Last updated:{" "}
              {ratingSource.idea_tracker_rating_last_updated ?? "-"}
            </p>
          </div>
        }
        triggerClasses="w-full"
        contentClasses="backdrop-blur-md shadow-2xl rounded-xl w-fit bg-neutral-800 max-w-[277px] min-w-[150px]"
        side="right"
      />
    );
  }

  return (
    <div className={`flex items-center gap-1 ${color}`}>
      {icon} {rating}
    </div>
  );
};
