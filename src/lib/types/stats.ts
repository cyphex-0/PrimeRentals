export interface AdminStatsResponse {
  totalUsers: number;
  totalProperties: number;
  totalRentals: number;
  totalRevenue: number;
  usersByRole: {
    TENANT: number;
    LANDLORD: number;
    ADMIN: number;
  };
  rentalsByStatus: {
    PENDING: number;
    APPROVED: number;
    REJECTED: number;
    ACTIVE: number;
    COMPLETED: number;
  };
  rentalsByMonth: { month: string; count: number }[];
  propertiesByCategory: { categoryName: string; count: number }[];
}

export interface LandlordStatsResponse {
  totalProperties: number;
  totalRequests: number;
  totalEarnings: number;
  requestsByStatus: {
    PENDING: number;
    APPROVED: number;
    REJECTED: number;
    ACTIVE: number;
    COMPLETED: number;
  };
  earningsByMonth: { month: string; amount: number }[];
}
