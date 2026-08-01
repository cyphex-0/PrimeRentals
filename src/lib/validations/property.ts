import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  address: z.string().min(1, "Address is required"),
  rent: z.number().positive("Rent must be a positive number"),
  bedrooms: z.number().int().min(1, "At least 1 bedroom required"),
  bathrooms: z.number().int().min(1, "At least 1 bathroom required"),
  area: z.number().positive("Area must be positive"),
  amenities: z.array(z.string()).min(1, "At least one amenity required"),
  images: z.array(z.string().url("Must be a valid URL"))
    .min(3, "At least 3 images are required")
    .max(15, "Maximum of 15 images allowed"),
  categoryId: z.string().min(1, "Category is required"),
});

export const updatePropertySchema = createPropertySchema.partial().extend({
  status: z.enum(["AVAILABLE", "RENTED", "MAINTENANCE"]).optional(),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
