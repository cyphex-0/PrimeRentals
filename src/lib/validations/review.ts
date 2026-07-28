import { z } from "zod";

export const createReviewSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().min(1, "Comment is required"),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
