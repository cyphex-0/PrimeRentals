import type { Property } from "./property";
import type { Payment } from "./payment";

export type RentalStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";

export interface RentalRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  moveInDate: string;
  moveOutDate: string;
  message: string | null;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
  property?: Property;
  tenant?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    profileImage?: string | null;
  };
  payment?: Payment;
}
