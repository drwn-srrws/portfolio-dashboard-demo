import { CustomCellRendererProps } from "@ag-grid-community/react";
import { replace } from "ramda";

import { useEditTable } from "@/providers/EditTableProvider/useEditTable";

import { useAuth } from "@/modules/auth/providers/AuthProvider";
import { RatingsDropdown } from "./RatingsDropdown";
import { useState } from "react";
import { RATING, Rating } from "./Rating";

const RatingController = ({ params }: { params: CustomCellRendererProps }) => {
  const [open, setOpen] = useState(false);

  const instrument_ticker = params?.data?.instrument_ticker;

  const { isEditable } = useEditTable();

  const { account } = useAuth();

  const row = params?.data;
  const accountId = account?.id;

  const canEdit = isEditable && row.analyst_id === accountId;

  if (canEdit) {
    return (
      <RatingsDropdown
        trigger={
          <Rating
            rating={RATING.BUY}
            ratingSource={{
              rating_date: "",
              instrument_id: 0,
              instrument_ticker: "",
              subsector: "",
              analyst_id: 0,
              analyst_name: "",
              rating_name: "",
              rating_value: 0,
              comment: "",
              idea_tracker_outdated_ratings: 0,
              idea_tracker_rating_last_updated: "",
            }}
            testId={`rating-dropdown`}
          />
        }
        open={open}
        ratingSource={{
          rating_date: "",
          instrument_id: 0,
          instrument_ticker: "",
          subsector: "",
          analyst_id: 0,
          analyst_name: "",
          rating_name: "",
          rating_value: 0,
          comment: "",
          idea_tracker_outdated_ratings: 0,
          idea_tracker_rating_last_updated: "",
        }}
        deadlineDate={""}
        tickerName={instrument_ticker}
        onOpenChange={setOpen}
        onUpdateRating={() => {}}
      />
    );
  } else {
    return (
      <Rating
        rating={RATING.BUY}
        ratingSource={{
          rating_date: "",
          instrument_id: 0,
          instrument_ticker: "",
          subsector: "",
          analyst_id: 0,
          analyst_name: "",
          rating_name: "",
          rating_value: 0,
          comment: "",
          idea_tracker_outdated_ratings: 0,
          idea_tracker_rating_last_updated: "",
        }}
        testId={`rating-button-${replace(" ", "-")(params.data?.category)}`}
      />
    );
  }
};

export default RatingController;
