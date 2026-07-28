import type { RentalRequest } from "./rental";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";
export type PaymentProvider = "STRIPE" | "SSLCOMMERZ";

export interface Payment {
  id: string;
  transactionId: string;
  rentalRequestId: string;
  tenantId: string;
  amount: string; // Decimal serialized as string
  method: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  rentalRequest?: RentalRequest;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  transactionId: string;
}
