import { apiPost, apiGet } from "./client";
import { Payment, PaymentIntentResponse } from "../types";

export const createPaymentIntent = (data: unknown) => apiPost<PaymentIntentResponse>("/payments/create", data);
export const confirmPayment = (data: unknown) => apiPost<Payment>("/payments/confirm", data);
export const simulatePayment = (data: unknown) => apiPost<Payment>("/payments/simulate-pay", data);
export const getPaymentHistory = () => apiGet<Payment[]>("/payments");
export const getPaymentById = (id: string) => apiGet<Payment>(`/payments/${id}`);
