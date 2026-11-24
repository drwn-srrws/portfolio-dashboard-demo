import { CompanyRatingType } from "@api/types";
import { IconNameType } from "@components/Icon/Icon";

export interface RatingInfo {
  icon: IconNameType;
  color: string;
  text: string;
  value: CompanyRatingType;
}
