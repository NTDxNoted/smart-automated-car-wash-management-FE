import adminAxiosInstance from '../api/adminAxiosInstance';

export const getOverviewReport = async ({ signal } = {}) => {
  const { data } = await adminAxiosInstance.get('/admin/reports/overview', { signal });
  return data;
};

export const getRfmReport = async ({ signal } = {}) => {
  const { data } = await adminAxiosInstance.get('/admin/reports/rfm', { signal });
  const rawList = data.data || data || [];
  return rawList.map(item => ({
    customerId: item.customerId ?? item.CustomerId,
    phone: item.phone ?? item.Phone,
    customer: item.fullName ?? item.FullName ?? "Vãng lai",
    recency: item.recencyDays ?? item.RecencyDays ?? 9999,
    frequency: item.frequency ?? item.Frequency ?? 0,
    monetary: item.monetaryTotal ?? item.MonetaryTotal ?? 0,
    points: item.totalPoints ?? item.TotalPoints ?? 0,
    tier: item.currentTier ?? item.CurrentTier ?? "Member",
  }));
};

export const getTierDistribution = async ({ signal } = {}) => {
  const { data } = await adminAxiosInstance.get('/admin/reports/tier-distribution', { signal });
  const rawList = data.data || data || [];
  return rawList.map(item => ({
    tier: item.tier ?? item.Tier ?? "Member",
    total: item.customerCount ?? item.CustomerCount ?? 0,
    percentage: item.percentage ?? item.Percentage ?? 0,
  }));
};

export const getLoyaltyStats = async ({ signal } = {}) => {
  const { data } = await adminAxiosInstance.get('/admin/reports/loyalty-stats', { signal });
  return {
    totalPoints: data.totalPointsInCirculation ?? data.TotalPointsInCirculation ?? 0,
    expiringSoon: data.pointsExpiringSoon ?? data.PointsExpiringSoon ?? 0,
    expired: data.expiredPoints ?? data.ExpiredPoints ?? 0,
  };
};

export const getPopularServices = async (startDate, endDate, { signal } = {}) => {
  const { data } = await adminAxiosInstance.get('/admin/reports/popular-services', {
    params: { startDate, endDate },
    signal
  });
  const rawList = data.data || data || [];
  return rawList.map((item, idx) => ({
    ranking: idx + 1,
    serviceName: item.serviceName ?? item.ServiceName ?? "Dịch vụ không xác định",
    totalWashes: item.usageCount ?? item.UsageCount ?? 0,
    revenue: item.totalRevenue ?? item.TotalRevenue ?? 0,
    revenueContribution: item.percentage ?? item.Percentage ?? 0
  }));
};

export const getPeakOccupancy = async (startDate, endDate, { signal } = {}) => {
  const { data } = await adminAxiosInstance.get('/admin/reports/peak-occupancy', {
    params: { startDate, endDate },
    signal
  });

  const totalDays = data.totalDays ?? data.TotalDays ?? 1;
  const maxParallelSlots = data.maxParallelSlots ?? data.MaxParallelSlots ?? 1;
  const weeksCount = totalDays / 7 || 1;

  const weeklyList = data.dayOfWeekStats ?? data.DayOfWeekStats ?? [];
  const hourlyList = data.hourStats ?? data.HourStats ?? [];

  return {
    weekly: weeklyList.map(item => {
      const count = item.bookingCount ?? item.BookingCount ?? 0;
      const calculatedRate = Math.min(100, Math.round((count / weeksCount / maxParallelSlots) * 100));
      return {
        day: item.dayOfWeek ?? item.DayOfWeek,
        count: count,
        occupancyRate: calculatedRate,
      };
    }),
    hourly: hourlyList.map(item => ({
      time: item.timeSlot ?? item.TimeSlot,
      count: item.bookingCount ?? item.BookingCount ?? 0,
      occupancyRate: item.occupancyPercentage ?? item.OccupancyPercentage ?? 0,
    })),
  };
};

export const getPromotionsRoi = async (startDate, endDate, { signal } = {}) => {
  const { data } = await adminAxiosInstance.get('/admin/reports/promotions-roi', {
    params: { startDate, endDate },
    signal
  });

  const items = data.items || data.Items || [];
  let totalDiscount = 0;
  let totalRevenue = 0;

  const promotions = items.map(item => {
    const discount = Number(item.totalDiscountGiven ?? item.TotalDiscountGiven ?? 0);
    const revenue = Number(item.revenueGenerated ?? item.RevenueGenerated ?? 0);
    totalDiscount += discount;
    totalRevenue += revenue;

    return {
      promoCode: item.promoCode ?? item.PromoCode,
      totalUsage: item.usageCount ?? item.UsageCount ?? 0,
      totalDiscount: discount,
      revenueGenerated: revenue,
    };
  });

  return {
    summary: {
      totalDiscount,
      totalRevenue,
    },
    promotions,
  };
};