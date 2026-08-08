import { apiPost } from "./client";
import { ContactInput } from "../validations/contact";

export const submitContactForm = (data: ContactInput) => apiPost("/contact", data);
