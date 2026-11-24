import { memo, useCallback, useState } from "react";
import { AxiosError } from "axios";
import {
  CompanyResponsePrimaryAnalystRating as Rating,
  CompanyRatingType,
  HTTPError,
} from "@api/types";
import { toast } from "@components/ui/use-toast";
import { useAuth } from "@modules/auth/providers/AuthProvider";
import { RatingDropdown } from "../../components/RatingDropdown";
import { RatingFormData } from "../../components/RatingForm/ratingSchema";
import { useOptimisticSetRating } from "../../hooks/useOptimisticSetRating";

export interface RatingCellContentProps {
  companyId: number;
  rating: Rating;
  primaryAnalystId: number | null;
}

export const RatingCellContent = memo(
  ({ companyId, rating, primaryAnalystId }: RatingCellContentProps) => {
    const { account: user } = useAuth();

    const { mutateAsync: setRating, isPending: isSaving } =
      useOptimisticSetRating();

    const [open, setOpen] = useState(false);

    const isCurrentUserPrimaryAnalyst = primaryAnalystId === user?.id;

    const saveChanges = useCallback(
      async (data: RatingFormData) => {
        try {
          await setRating({
            companyId,
            data: {
              rating: data.rating as CompanyRatingType,
              comment: data.comment,
            },
          });
          toast({
            title: "Rating updated",
          });
        } catch (error) {
          const axiosError = error as AxiosError<HTTPError>;
          toast({
            title: "Error setting rating",
            description: axiosError.response?.data.detail,
            variant: "destructive",
          });
        }
      },
      [companyId, setRating]
    );

    const handleSave = useCallback(
      async (data: RatingFormData) => {
        await saveChanges(data);
        setOpen(false);
      },
      [saveChanges]
    );

    return (
      <RatingDropdown
        disableSave={!isCurrentUserPrimaryAnalyst}
        testId={`rating-[${companyId}]`}
        data={rating}
        open={open}
        isSaving={isSaving}
        onOpenChange={setOpen}
        onSave={handleSave}
      />
    );
  }
);
