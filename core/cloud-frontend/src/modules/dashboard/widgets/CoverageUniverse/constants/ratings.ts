import { CompanyRatingType } from "@api/types";
import { RatingInfo } from "../types/RatingInfo";

export const ratings: RatingInfo[] = [
  {
    icon: "ChevronsUp",
    color: "#2EAE5C",
    text: "Large Buy",
    value: CompanyRatingType.LARGE_BUY,
  },
  {
    icon: "ChevronUp",
    color: "#2EAE5C",
    text: "Small Buy",
    value: CompanyRatingType.SMALL_BUY,
  },
  {
    icon: "CircleMinus",
    color: "#A3A3A3",
    text: "Neutral",
    value: CompanyRatingType.NEUTRAL,
  },
  {
    icon: "ChevronDown",
    color: "#E8525F",
    text: "Small Sell",
    value: CompanyRatingType.SMALL_SELL,
  },
  {
    icon: "ChevronsDown",
    color: "#E8525F",
    text: "Large Sell",
    value: CompanyRatingType.LARGE_SELL,
  },
];

export const getRatingInfo = (type: CompanyRatingType): RatingInfo | null =>
  ratings.find((rating) => rating.value === type) ?? null;
