import { useEffect, useState } from "react";
import Papa from "papaparse";

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

  const exportCSV = () => {
    if (!rfm || rfm.length === 0) return;
    const exportData = rfm.map((row) => ({
      customer: row.customer,
      recency: Number(row.recency),
      frequency: Number(row.frequency),
      monetary: Number(row.monetary),
      points: Number(row.points),
      tier: row.tier,
    }));

    const csv = "\uFEFF" + Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reports-export.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!overview || !loyalty) {
    return (
        <div className="flex items-center justify-center h-64 text-slate-500">
            <span className="material-symbols-outlined animate-spin mr-2">refresh</span>
            Đang tải dữ liệu báo cáo...
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Reports Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">Performance overview and customer analytics</p>
        </div>
        <button 
            onClick={exportCSV}
            className="flex items-center gap-2 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shadow-sm bg-white"
        >
            <span className="material-symbols-outlined text-lg">download</span>
            Export CSV
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <SummaryCard
          title="REVENUE"
          value={`${overview.summary.revenue.toLocaleString()} VNĐ`}
          trend="+12.5% this month"
          trendUp={true}
        />

        <SummaryCard
          title="BOOKINGS"
          value={overview.summary.bookings}
          trend="+8.2% this month"
          trendUp={true}
        />

        <SummaryCard
          title="CUSTOMERS"
          value={overview.summary.customers}
          trend="+5.4% this month"
          trendUp={true}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 text-lg">Overview</h3>
                <button className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-xl">more_horiz</span></button>
            </div>
            <OverviewChart data={overview.revenue} />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 text-lg">Booking Status</h3>
                <button className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-xl">more_horiz</span></button>
            </div>
            <BookingStatusPieChart data={overview.bookingStatus} />
        </div>
      </div>

      <RfmTable data={rfm} />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <TierDistributionChart data={tiers} />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <LoyaltyStatsPanel stats={loyalty} />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, trend, trendUp }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-400 text-sm">
                  {title === 'REVENUE' ? 'payments' : title === 'BOOKINGS' ? 'calendar_month' : 'group'}
              </span>
          </div>
      </div>
      <div>
          <h3 className="text-slate-800 text-3xl font-bold">
            {value}
          </h3>
          <p className={`mt-2 text-sm font-semibold flex items-center gap-1 ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
            <span className="material-symbols-outlined text-[16px]">{trendUp ? 'trending_up' : 'trending_down'}</span>
            {trend}
          </p>
      </div>
    </div>
  );
}
