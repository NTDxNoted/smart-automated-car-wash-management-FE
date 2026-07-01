import adminAxiosInstance from "../api/adminAxiosInstance";

export const getOverviewReport = async ({ signal } = {}) => {
  const { data: responseData } = await adminAxiosInstance.get("/api/admin/reports/overview", { signal });
  const data = responseData || {};
  
  const pending = (data.totalBookings || 0) 
    - (data.completedBookings || 0) 
    - (data.cancelledBookings || 0) 
    - (data.noShowBookings || 0) 
    - (data.failedBookings || 0);

  return {
    revenue: [
      { month: data.period || "Current", revenue: data.totalRevenue || 0 },
    ],
    bookingStatus: [
      { name: "Completed", value: data.completedBookings || 0 },
      { name: "Pending", value: pending > 0 ? pending : 0 },
      { name: "Cancelled", value: data.cancelledBookings || 0 },
      { name: "No-Show", value: data.noShowBookings || 0 },
      { name: "Failed", value: data.failedBookings || 0 }
    ],
    summary: {
      revenue: data.totalRevenue || 0,
      bookings: data.totalBookings || 0,
      customers: 0,
    }
  };
};

export const getRfmReport = async ({ signal } = {}) => {
  const { data } = await adminAxiosInstance.get("/api/admin/reports/rfm", { signal });
  return data?.data || [];
};

export const getTierDistribution = async ({ signal } = {}) => {
  const { data } = await adminAxiosInstance.get("/api/admin/reports/tier-distribution", { signal });
  return data?.data || [];
};

export const getLoyaltyStats = async ({ signal } = {}) => {
  const { data } = await adminAxiosInstance.get("/api/admin/reports/loyalty-stats", { signal });
  return data || {};
};