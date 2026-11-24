import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/ui";
import {
  ratingDefaultValues,
  RatingFormData,
  ratingSchema,
} from "./ratingSchema";
import { FormTextArea } from "../TextArea";
import { FormRatingPicker } from "../RatingPicker/FormRatingPicker";

export interface RatingFormProps {
  defaultValues?: RatingFormData;
  submissionDate?: string | null;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (data: RatingFormData) => void;
}

export const RatingForm = ({
  defaultValues,
  submissionDate,
  isSaving,
  onClose,
  onSave,
}: RatingFormProps) => {
  const { control, handleSubmit } = useForm<RatingFormData>({
    defaultValues: defaultValues ?? ratingDefaultValues,
    resolver: zodResolver(ratingSchema),
  });

  return (
    <form className="flex flex-col gap-5 p-4" onSubmit={handleSubmit(onSave)}>
      <h4 className="text-xl font-medium leading-4">Ratings</h4>
      <div>
        {submissionDate && (
          <div className="text-base text-neutral-400">
            Submission date: {submissionDate}
          </div>
        )}
      </div>

      <FormRatingPicker name="rating" control={control} />

      <FormTextArea
        required
        name="comment"
        control={control}
        maxLength={255}
        data-testid="rating-comment-textarea"
      />

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="bg-neutral-600 text-foreground hover:bg-neutral-600/80"
          type="submit"
          data-testid="rating-save-button"
          disabled={isSaving}
        >
          {isSaving ? "Updating..." : "Save"}
        </Button>
      </div>
    </form>
  );
};
