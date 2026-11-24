import { z } from "zod";

export const ratingSchema = z.object({
  rating: z.string().min(1),
  comment: z.string().min(1),
});

export type RatingFormData = z.infer<typeof ratingSchema>;

export const ratingDefaultValues: RatingFormData = {
  rating: "",
  comment: "",
};
