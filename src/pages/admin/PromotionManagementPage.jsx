import React, { useEffect, useState } from 'react';
import adminPromotionService from '../../services/adminPromotionService';
import PromotionModal from '../../components/admin/PromotionModal';
import AdminSwitch from '../../components/admin/AdminSwitch';

const PromotionManagementPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [togglingIds, setTogglingIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const res = await adminPromotionService.getPromotions();
      setPromotions(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      ...form,
      value: Number(form.value),
      maxUsage: Number(form.maxUsage),
    };

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

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Quản lý khuyến mãi
            </h2>
            <p className="text-sm text-slate-500 mt-1">Configure and manage discount campaigns</p>
          </div>
          <button 
            onClick={handleCreate} 
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Promotion
          </button>
        </div>

        <div className="flex-1 rounded-xl border border-slate-200 overflow-hidden mb-2">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50 border-b border-slate-200">
                <tr className="divide-x divide-slate-200">
                  <th className="px-6 py-5">PROMOTION</th>
                  <th className="px-6 py-5">MIN TIER</th>
                  <th className="px-6 py-5">DISCOUNT TYPE</th>
                  <th className="px-6 py-5">VALUE</th>
                  <th className="px-6 py-5">MAX USAGE</th>
                  <th className="px-6 py-5 text-center">STATUS</th>
                  <th className="px-6 py-5 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-slate-500">Đang tải dữ liệu...</td>
                  </tr>
                ) : promotions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">local_offer</span>
                        <p>No promotions found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  promotions.map((item) => (
                    <tr key={item.id || item.promotionID} className="hover:bg-slate-50 transition-colors divide-x divide-slate-100">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{item.promoCode}</span>
                          <span className="text-xs text-slate-500">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                          {(() => {
                            const tierVal = typeof item.minTier === 'object' ? (item.minTier?.tierName || item.minTier?.name || '') : (item.minTier || '');
                            const tierStr = tierVal.toUpperCase();
                            if (tierStr === 'MEMBER') return <><span className="material-symbols-outlined text-[14px]">person</span>MEMBER</>;
                            if (tierStr === 'SILVER') return <><span className="material-symbols-outlined text-[14px]">military_tech</span>SILVER</>;
                            if (tierStr === 'GOLD') return <><span className="material-symbols-outlined text-[14px]">star</span>GOLD</>;
                            if (tierStr === 'PLATINUM') return <><span className="material-symbols-outlined text-[14px]">diamond</span>PLATINUM</>;
                            return tierStr || 'N/A';
                          })()}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">{item.discountType}</td>
                      <td className="px-6 py-4 font-bold text-cyan-600">
                        {item.discountType === 'PERCENTAGE' ? `${item.value}%` : `${Number(item.value).toLocaleString()} đ`}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">{item.maxUsage}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <AdminSwitch
                            checked={item.isActive}
                            loading={togglingIds.includes(item.id)}
                            disabled={togglingIds.includes(item.id)}
                            onChange={() => handleToggle(item)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEdit(item)} 
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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