import { z } from "zod";

export const createRentalRequestSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  moveInDate: z.string().min(1, "Move-in date is required"),
  moveOutDate: z.string().optional().or(z.literal("")),
  message: z.string().optional(),
}).refine(
  (data) => new Date(data.moveInDate) >= new Date(new Date().toDateString()),
  { message: "Move-in date cannot be in the past", path: ["moveInDate"] }
).refine(
  (data) => {
    if (!data.moveOutDate) return true;
    return new Date(data.moveOutDate) > new Date(data.moveInDate);
  },
  { message: "Move-out date must be after move-in date", path: ["moveOutDate"] }
);

export type CreateRentalRequestInput = z.infer<typeof createRentalRequestSchema>;
