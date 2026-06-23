import { useEffect, useState } from "react";

import OverviewChart from "../../components/admin/OverviewChart";
import RfmTable from "../../components/admin/RfmTable";
import TierDistributionChart from "../../components/admin/TierDistributionChart";
import LoyaltyStatsPanel from "../../components/admin/LoyaltyStatsPanel";
import BookingStatusPieChart from "../../components/admin/BookingStatusPieChart";

import {
  getOverviewReport,
  getRfmReport,
  getTierDistribution,
  getLoyaltyStats,
} from "../../services/adminReportService";

export default function ReportPage() {
  const [overview, setOverview] = useState(null);
  const [rfm, setRfm] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [loyalty, setLoyalty] = useState(null);

  useEffect(() => {
  const controller = new AbortController();
  let isMounted = true;

  const loadData = async () => {
    try {
      const [overviewData, rfmData, tierData, loyaltyData] = await Promise.all([
        getOverviewReport({ signal: controller.signal }),
        getRfmReport({ signal: controller.signal }),
        getTierDistribution({ signal: controller.signal }),
        getLoyaltyStats({ signal: controller.signal }),
      ]);

      if (!isMounted) return;

      setOverview(overviewData);
      setRfm(rfmData);
      setTiers(tierData);
      setLoyalty(loyaltyData);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    }
  };

  loadData();

  return () => {
    isMounted = false;
    controller.abort();
  };
}, []);

  if (!overview || !loyalty) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">
        Reports Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-5">
        <SummaryCard
          title="Revenue"
          value={`${overview.summary.revenue.toLocaleString()} VNĐ`}
        />

        <SummaryCard
          title="Bookings"
          value={overview.summary.bookings}
        />

        <SummaryCard
          title="Customers"
          value={overview.summary.customers}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
  <OverviewChart
    data={overview.revenue}
  />

  <BookingStatusPieChart
    data={overview.bookingStatus}
  />
</div>

      <RfmTable data={rfm} />

      <TierDistributionChart
        data={tiers}
      />

      <LoyaltyStatsPanel
        stats={loyalty}
      />
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="bg-[#0c0f24] p-5 rounded-2xl border border-white/5">
      <p className="text-slate-400">{title}</p>

      <h3 className="text-white text-2xl font-bold mt-2">
        {value}
      </h3>
    </div>
  );
}
