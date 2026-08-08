import { apiGet } from "./client";
import { AdminStatsResponse, LandlordStatsResponse } from "../types";

export const getAdminStats = () => apiGet<AdminStatsResponse>("/admin/stats");
export const getLandlordStats = () => apiGet<LandlordStatsResponse>("/landlord/stats");
