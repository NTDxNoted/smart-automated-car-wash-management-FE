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

  const [activeTab, setActiveTab] = useState("overview");

  if (!overview || !loyalty) {
    return (
      <div className="py-12 text-center text-slate-400 bg-[#0c0f24] rounded-2xl border border-white/5">
        <div className="inline-block w-8 h-8 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mb-2"></div>
        <p className="text-sm font-medium">Đang tải báo cáo thống kê...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Báo cáo & Phân tích</h2>
          <p className="text-slate-400 text-sm mt-1">
            Theo dõi tổng quan vận hành, số liệu Loyalty và bảng dữ liệu khách hàng RFM
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-white/10 gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { id: "overview", label: "Overview", icon: "📊" },
          { id: "rfm", label: "Phân tích RFM", icon: "🧠" },
          { id: "tiers", label: "Tier Distribution", icon: "👑" },
          { id: "loyalty", label: "Loyalty Stats", icon: "💎" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-xl text-sm font-semibold transition cursor-pointer shrink-0 border-b-2 ${
              activeTab === tab.id
                ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-5">
            <SummaryCard
              title="Tổng doanh thu"
              value={`${overview.summary.revenue.toLocaleString()} VNĐ`}
            />
            <SummaryCard
              title="Tổng số Bookings"
              value={overview.summary.bookings}
            />
            <SummaryCard
              title="Tổng số Customers"
              value={overview.summary.customers}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <OverviewChart data={overview.revenue} />
            <BookingStatusPieChart data={overview.bookingStatus} />
          </div>
        </div>
      )}

      {activeTab === "rfm" && (
        <div className="transition-all">
          <RfmTable data={rfm} />
        </div>
      )}

      {activeTab === "tiers" && (
        <div className="transition-all">
          <TierDistributionChart data={tiers} />
        </div>
      )}

      {activeTab === "loyalty" && (
        <div className="transition-all">
          <LoyaltyStatsPanel stats={loyalty} />
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="bg-[#0c0f24] p-5 rounded-2xl border border-white/5 shadow-md">
      <p className="text-slate-400 text-sm">{title}</p>
      <h3 className="text-white text-2xl font-bold mt-2">
        {value}
      </h3>
    </div>
  );
}
