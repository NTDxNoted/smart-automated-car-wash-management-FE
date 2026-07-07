import adminAxiosInstance from '../api/adminAxiosInstance';

const USE_MOCK_DATA = false; // Gạt thành false để kết nối với API thật của backend

export const getOverviewReport = async ({ signal } = {}) => {
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

  const { data } = await adminAxiosInstance.get('/admin/reports/overview', { signal });
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
export const getPopularServices = async (startDate, endDate, { signal } = {}) => {
  if (USE_MOCK_DATA) {
    return [
      { serviceName: "Rửa xe bọt tuyết", ranking: 1, totalWashes: 120, revenue: 18000000, revenueContribution: 45.5 },
      { serviceName: "Phủ nano bóng sơn", ranking: 2, totalWashes: 60, revenue: 15000000, revenueContribution: 37.97 },
      { serviceName: "Vệ sinh nội thất", ranking: 3, totalWashes: 40, revenue: 6000000, revenueContribution: 15.19 },
      { serviceName: "Tẩy ố kính", ranking: 4, totalWashes: 10, revenue: 500000, revenueContribution: 1.34 }
    ];
  }

  const { data } = await adminAxiosInstance.get('/admin/reports/popular-services', {
    params: { startDate, endDate },
    signal
  });
  return data.data || data;
};

export const getPeakOccupancy = async (startDate, endDate, { signal } = {}) => {
  if (USE_MOCK_DATA) {
    return {
      weekly: [
        { day: "Monday", count: 42, occupancyRate: 65 },
        { day: "Tuesday", count: 35, occupancyRate: 54 },
        { day: "Wednesday", count: 38, occupancyRate: 58 },
        { day: "Thursday", count: 48, occupancyRate: 74 },
        { day: "Friday", count: 62, occupancyRate: 85 }, // Over 80% highlight!
        { day: "Saturday", count: 75, occupancyRate: 92 }, // Over 80% highlight!
        { day: "Sunday", count: 68, occupancyRate: 88 } // Over 80% highlight!
      ],
      hourly: [
        { time: "07:30", count: 12, occupancyRate: 40 },
        { time: "09:00", count: 28, occupancyRate: 85 }, // Over 80%
        { time: "10:30", count: 32, occupancyRate: 95 }, // Over 80%
        { time: "12:00", count: 15, occupancyRate: 45 },
        { time: "13:30", count: 22, occupancyRate: 68 },
        { time: "15:00", count: 30, occupancyRate: 90 }, // Over 80%
        { time: "16:30", count: 18, occupancyRate: 55 }
      ]
    };
  }

  const { data } = await adminAxiosInstance.get('/admin/reports/peak-occupancy', {
    params: { startDate, endDate },
    signal
  });
  return data.data || data;
};

export const getPromotionsRoi = async (startDate, endDate, { signal } = {}) => {
  if (USE_MOCK_DATA) {
    return {
      summary: {
        totalDiscount: 8500000,
        totalRevenue: 45000000
      },
      promotions: [
        { promoCode: "HELLOSUMMER", totalUsage: 150, totalDiscount: 3000000, revenueGenerated: 18000000 },
        { promoCode: "VIPCARWASH", totalUsage: 80, totalDiscount: 4000000, revenueGenerated: 20000000 },
        { promoCode: "CLEAN10", totalUsage: 50, totalDiscount: 1500000, revenueGenerated: 7000000 }
      ]
    };
  }

  const { data } = await adminAxiosInstance.get('/admin/reports/promotions-roi', {
    params: { startDate, endDate },
    signal
  });
  return data.data || data;
};