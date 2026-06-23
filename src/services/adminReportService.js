export const getOverviewReport = async ({ signal } = {}) => {
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
};

export const getRfmReport = async ({ signal } = {}) => {
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
};

export const getTierDistribution = async ({ signal } = {}) => {
  return [
    { tier: "Member", total: 120 },
    { tier: "Silver", total: 80 },
    { tier: "Gold", total: 45 },
    { tier: "Platinum", total: 20 },
  ];
};

export const getLoyaltyStats = async ({ signal } = {}) => {
  return {
    totalPoints: 120500,
    expiringSoon: 3200,
    expired: 800,
  };
};