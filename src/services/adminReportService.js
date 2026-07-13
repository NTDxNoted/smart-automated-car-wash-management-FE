import adminAxiosInstance from '../api/adminAxiosInstance';

const USE_MOCK_DATA = false; // Gạt thành false để kết nối với API thật của backend

export const getOverviewReport = async ({ filterType, startDate, endDate, signal } = {}) => {
  if (USE_MOCK_DATA) {
    return {
      revenue: [
        { month: "Jan", revenue: 12000000 },
        { month: "Feb", revenue: 15000000 },
        { month: "Mar", revenue: 18000000 },
        { month: "Apr", revenue: 14000000 },
        { month: "May", revenue: 22000000 },
        { month: "Jun", revenue: 26000000 },
      ],
      bookingStatus: [
        { name: "Completed", value: 65 },
        { name: "Pending", value: 20 },
        { name: "Cancelled", value: 15 },
      ],
      summary: {
        revenue: 26000000,
        bookings: 245,
        customers: 265,
      },
    };
  }

  const { data } = await adminAxiosInstance.get('/admin/reports/overview', {
    params: { filterType, startDate, endDate },
    signal
  });
  return data;
};

export const getPopularServicesReport = async ({ startDate, endDate, signal } = {}) => {
  if (USE_MOCK_DATA) {
    return [
      { serviceId: 1, serviceName: "Rửa xe máy siêu sạch", usageCount: 45, totalRevenue: 1350000, percentage: 30 },
      { serviceId: 2, serviceName: "Rửa ô tô tiêu chuẩn", usageCount: 65, totalRevenue: 9750000, percentage: 43.3 },
      { serviceId: 3, serviceName: "Vệ sinh khoang máy", usageCount: 40, totalRevenue: 20000000, percentage: 26.7 },
    ];
  }
  const { data } = await adminAxiosInstance.get('/admin/reports/popular-services', {
    params: { startDate, endDate },
    signal
  });
  return data;
};

export const getRfmReport = async ({ signal } = {}) => {
  if (USE_MOCK_DATA) {
    return [
      {
        customer: "Nguyễn Văn A",
        recency: 5,
        frequency: 22,
        monetary: 5200000,
        points: 1200,
        tier: "Gold",
      },
      {
        customer: "Trần Văn B",
        recency: 2,
        frequency: 35,
        monetary: 9000000,
        points: 2000,
        tier: "Platinum",
      },
      {
        customer: "Lê Văn C",
        recency: 12,
        frequency: 10,
        monetary: 2500000,
        points: 500,
        tier: "Silver",
      },
    ];
  }

  const { data } = await adminAxiosInstance.get('/admin/reports/rfm', { signal });
  return data.data || data;
};

export const getTierDistribution = async ({ signal } = {}) => {
  if (USE_MOCK_DATA) {
    return [
      { tier: "Member", total: 120 },
      { tier: "Silver", total: 80 },
      { tier: "Gold", total: 45 },
      { tier: "Platinum", total: 20 },
    ];
  }

  const { data } = await adminAxiosInstance.get('/admin/reports/tier-distribution', { signal });
  return data.data || data;
};

export const getLoyaltyStats = async ({ signal } = {}) => {
  if (USE_MOCK_DATA) {
    return {
      totalPoints: 120500,
      expiringSoon: 3200,
      expired: 800,
    };
  }

  const { data } = await adminAxiosInstance.get('/admin/reports/loyalty-stats', { signal });
  return data;
};

// Cập nhật thêm các API báo cáo mới từ backend nếu cần dùng ở frontend
export const getPeakOccupancy = async (startDate, endDate, { signal } = {}) => {
  const { data } = await adminAxiosInstance.get('/admin/reports/peak-occupancy', {
    params: { startDate, endDate },
    signal
  });
  return data;
};

export const getPromotionsRoi = async (startDate, endDate, { signal } = {}) => {
  const { data } = await adminAxiosInstance.get('/admin/reports/promotions-roi', {
    params: { startDate, endDate },
    signal
  });
  return data;
};