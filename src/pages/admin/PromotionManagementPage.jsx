import React, { useEffect, useState } from 'react';
import adminPromotionService from '../../services/adminPromotionService';
import PromotionModal from '../../components/admin/PromotionModal';
import AdminSwitch from '../../components/admin/AdminSwitch';

const PromotionManagementPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [togglingIds, setTogglingIds] = useState([]);

  const fetchPromotions = async () => {
    try {
      const res = await adminPromotionService.getPromotions();
      const rawList = res.data?.data || res.data || [];
      const mapped = rawList.map(item => {
        let dType = item.discountType ?? item.DiscountType;
        if (dType === 'Percentage') dType = 'PERCENT';
        if (dType === 'Fixed_Amount') dType = 'FIXED';

        let minTierVal = item.minTier ?? item.MinTierID ?? item.minTierId;
        let minTierDisplay = '';
        let minTierId = null;

        if (minTierVal) {
          if (typeof minTierVal === 'object') {
            minTierDisplay = minTierVal.tierName ?? minTierVal.TierName ?? minTierVal.name ?? '';
            minTierId = minTierVal.tierID ?? minTierVal.tierId ?? minTierVal.id;
          } else {
            minTierDisplay = minTierVal;
            minTierId = minTierVal;
          }
        }

        return {
          id: item.promotionId ?? item.promotionID ?? item.PromotionID ?? item.id,
          title: item.title ?? item.Title,
          promoCode: item.promoCode ?? item.PromoCode,
          minTier: minTierDisplay,
          minTierId: minTierId,
          minTierID: minTierId,
          discountType: dType,
          value: item.value ?? item.discountValue ?? item.DiscountValue,
          maxUsage: item.maxUsage ?? item.MaxUsage,
          startDate: item.startDate ?? item.StartDate,
          endDate: item.endDate ?? item.EndDate,
          isActive: item.isActive !== undefined ? item.isActive : (item.IsActive !== undefined ? item.IsActive : true),
        };
      });
      setPromotions(mapped);
    } catch (err) {
      console.error("Error fetching promotions:", err);
      setPromotions([]);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleCreate = () => {
    setSelectedPromotion(null);
    setOpenModal(true);
  };

  const handleEdit = (promotion) => {
    setSelectedPromotion(promotion);
    setOpenModal(true);
  };

  const handleSubmit = async (form) => {
    const payload = {
      title: form.title,
      promoCode: form.promoCode,
      minTier: form.minTier,
      minTierId: form.minTier ? Number(form.minTier) : null,
      minTierID: form.minTier ? Number(form.minTier) : null,
      discountValue: Number(form.value),
      value: Number(form.value),
      maxUsage: Number(form.maxUsage),
      startDate: form.startDate,
      endDate: form.endDate,
      isActive: form.isActive !== undefined ? form.isActive : true,
      IsActive: form.isActive !== undefined ? form.isActive : true,
    };

    if (form.discountType === 'PERCENT' || form.discountType === 'Percentage') {
      payload.discountType = 'Percentage';
      payload.DiscountType = 'Percentage';
    } else if (form.discountType === 'FIXED' || form.discountType === 'Fixed_Amount') {
      payload.discountType = 'Fixed_Amount';
      payload.DiscountType = 'Fixed_Amount';
    }

    if (selectedPromotion) {
      await adminPromotionService.updatePromotion(selectedPromotion.id, payload);
    } else {
      await adminPromotionService.createPromotion(payload);
    }

    setOpenModal(false);
    await fetchPromotions();
  };

  const handleToggle = async (promotion) => {
    if (togglingIds.includes(promotion.id)) return;

    setTogglingIds((prev) => [...prev, promotion.id]);

    try {
      await adminPromotionService.togglePromotion(promotion.id);
      await fetchPromotions();
    } finally {
      setTogglingIds((prev) => prev.filter((id) => id !== promotion.id));
    }
  };

  const getTierDisplayBadge = (tier) => {
    if (!tier) return <span className="text-slate-500">-</span>;
    const tierName = String(tier);
    switch (tierName.toUpperCase()) {
      case "PLATINUM":
        return (
          <span className="bg-gradient-to-r from-slate-300 via-indigo-100 to-indigo-300 text-indigo-950 font-bold px-2 py-0.5 rounded text-[10px] shadow border border-indigo-200/50">
            {tierName}
          </span>
        );
      case "GOLD":
        return (
          <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-bold px-2 py-0.5 rounded text-[10px] shadow border border-amber-300/50">
            {tierName}
          </span>
        );
      case "SILVER":
        return (
          <span className="bg-gradient-to-r from-slate-400 to-slate-200 text-slate-900 font-bold px-2 py-0.5 rounded text-[10px] shadow border border-slate-350/50">
            {tierName}
          </span>
        );
      default:
        return (
          <span className="bg-cyan-950/40 text-cyan-400 px-2 py-0.5 rounded text-[10px] border border-cyan-500/30 font-bold">
            {tierName}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Quản lý khuyến mãi</h2>
          <p className="text-slate-400 text-sm mt-1">
            Thiết lập mã giảm giá, chương trình tri ân thành viên và giới hạn lượt áp dụng
          </p>
        </div>
      </div>

      {/* Promotion List Table */}
      <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white text-lg font-bold">
            Chương trình ưu đãi
          </h3>

          <button
            onClick={handleCreate}
            className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition duration-200 shadow-md shadow-cyan-500/10 cursor-pointer flex items-center gap-1.5"
          >
            <span>+</span> Thêm khuyến mãi
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-slate-455 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 text-left">Tên ưu đãi</th>
                <th className="px-6 py-4 text-left">Mã ưu đãi</th>
                <th className="px-6 py-4 text-left">Hạng áp dụng</th>
                <th className="px-6 py-4 text-left">Loại giảm</th>
                <th className="px-6 py-4 text-left">Mức giảm</th>
                <th className="px-6 py-4 text-left">Giới hạn</th>
                <th className="px-6 py-4 text-left">Trạng thái</th>
                <th className="px-6 py-4 text-right">Tác vụ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {promotions.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-white/[0.01] transition-all duration-150"
                >
                  <td className="px-6 py-4 text-slate-200 font-semibold text-sm">
                    {item.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded font-mono bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 text-xs font-bold">
                      {item.promoCode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getTierDisplayBadge(item.minTier)}
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-xs font-bold">
                    {item.discountType === 'PERCENT' ? 'Phần trăm' : 'Tiền mặt'}
                  </td>
                  <td className="px-6 py-4 text-slate-200 font-semibold font-mono">
                    {item.discountType === 'PERCENT' ? `${item.value}%` : `${item.value?.toLocaleString()}đ`}
                  </td>
                  <td className="px-6 py-4 text-slate-350 font-mono text-xs">
                    {item.maxUsage?.toLocaleString() || 'Không giới hạn'}
                  </td>
                  <td className="px-6 py-4">
                    <AdminSwitch
                      checked={item.isActive}
                      loading={togglingIds.includes(item.id)}
                      disabled={togglingIds.includes(item.id)}
                      onChange={() => handleToggle(item)}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-[#070913] hover:bg-white/[0.04] border border-white/10 text-cyan-400 font-bold px-3.5 py-1.5 rounded-lg text-xs transition cursor-pointer"
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PromotionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        initialData={selectedPromotion}
      />
    </div>
  );
};

export default PromotionManagementPage;