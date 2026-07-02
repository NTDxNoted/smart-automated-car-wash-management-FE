import React, { useEffect, useState } from 'react';
import adminTierService from '../../services/adminTierService';
import TierModal from '../../components/admin/TierModal';

const TierConfigPage = () => {
  const [tiers, setTiers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  const fetchTiers = async () => {
    try {
      const res = await adminTierService.getTiers();
      const rawList = res.data?.data || res.data || [];
      const mapped = rawList.map(t => ({
        id: t.tierID ?? t.tierId ?? t.TierID ?? t.id,
        name: t.tierName ?? t.TierName ?? t.name,
        minSpending: t.minSpending ?? t.MinSpending ?? 0,
        discountRate: t.discountRate ?? t.DiscountRate ?? 0,
        bookingWindowDays: t.bookingWindowDays ?? t.BookingWindowDays ?? 7,
      }));
      setTiers(mapped);
    } catch (err) {
      console.error("Error fetching tiers:", err);
      setTiers([]);
    }
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  const handleEdit = (tier) => {
    setSelectedTier(tier);
    setOpenModal(true);
  };

  const handleSubmit = async (form) => {
    const payload = {
      tierName: selectedTier.name,
      TierName: selectedTier.name,
      minSpending: Number(form.minSpending),
      MinSpending: Number(form.minSpending),
      discountRate: Number(form.discountRate),
      DiscountRate: Number(form.discountRate),
      bookingWindowDays: Number(form.bookingWindowDays),
      BookingWindowDays: Number(form.bookingWindowDays),
    };

    await adminTierService.updateTier(selectedTier.id, payload);

    setOpenModal(false);
    await fetchTiers();
  };

  const getTierBadgeStyle = (name) => {
    switch (name?.toUpperCase()) {
      case "PLATINUM":
        return "bg-gradient-to-r from-slate-350 via-indigo-100 to-indigo-300 text-indigo-950 font-extrabold px-3 py-1 rounded-md text-xs shadow border border-indigo-200/50";
      case "GOLD":
        return "bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-extrabold px-3 py-1 rounded-md text-xs shadow border border-amber-300/50";
      case "SILVER":
        return "bg-gradient-to-r from-slate-450 to-slate-200 text-slate-900 font-extrabold px-3 py-1 rounded-md text-xs shadow border border-slate-350/50";
      default:
        return "bg-cyan-950/40 text-cyan-400 px-3 py-1 rounded-md text-xs border border-cyan-500/30 font-bold";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Cấu hình hạng thành viên</h2>
          <p className="text-slate-400 text-sm mt-1">
            Thiết lập điều kiện chi tiêu để thăng hạng, tỉ lệ giảm giá và quyền lợi đặt lịch
          </p>
        </div>
      </div>

      {/* Tier Config Table Card */}
      <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5 shadow-xl">
        <h3 className="text-white text-lg font-bold mb-6">
          Chính sách hạng thành viên
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-slate-455 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 text-left">Hạng thành viên</th>
                <th className="px-6 py-4 text-left">Chi tiêu tối thiểu</th>
                <th className="px-6 py-4 text-left">Ưu đãi giảm giá</th>
                <th className="px-6 py-4 text-left">Thời hạn đặt lịch tối đa</th>
                <th className="px-6 py-4 text-right">Tác vụ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {tiers.map((tier) => (
                <tr
                  key={tier.id}
                  className="hover:bg-white/[0.01] transition-all duration-150"
                >
                  <td className="px-6 py-4">
                    <span className={getTierBadgeStyle(tier.name)}>
                      {tier.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-200 font-semibold font-mono">
                    {tier.minSpending?.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4 text-slate-200 font-bold font-mono">
                    {tier.discountRate}%
                  </td>
                  <td className="px-6 py-4 text-slate-350 font-mono text-sm">
                    {tier.bookingWindowDays} ngày
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(tier)}
                      className="bg-[#070913] hover:bg-white/[0.04] border border-white/10 text-cyan-400 font-bold px-3.5 py-1.5 rounded-lg text-xs transition cursor-pointer"
                    >
                      Cập nhật
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TierModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        initialData={selectedTier}
      />
    </div>
  );
};

export default TierConfigPage;