import { apiGet } from "./client";
import { Category } from "../types";

export const getCategories = () => apiGet<Category[]>("/categories");
