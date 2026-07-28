import { apiPost } from "./client";
import { Review } from "../types";

import { CreateReviewInput } from "../validations/review";

export const createReview = (data: CreateReviewInput) => apiPost<Review>("/reviews", data);
