import { GetRating as GetRatingBase } from "@/utils/table";

export type GetRating = GetRatingBase & {
  idea_tracker_rating_last_updated?: string;
  idea_tracker_outdated_ratings?: number;
};
