import React, { useEffect, useState } from 'react';
import adminTierService from '../../services/adminTierService';
import TierModal from '../../components/admin/TierModal';

const TIER_ICONS = {
  MEMBER: { icon: 'person', color: 'text-cyan-500', bg: 'bg-cyan-100', border: 'border-cyan-200' },
  SILVER: { icon: 'military_tech', color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-300' },
  GOLD: { icon: 'star', color: 'text-amber-500', bg: 'bg-amber-100', border: 'border-amber-200' },
  PLATINUM: { icon: 'diamond', color: 'text-fuchsia-500', bg: 'bg-fuchsia-100', border: 'border-fuchsia-200' },
};

export default function TierConfigPage() {
  const [tiers, setTiers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTiers = async () => {
    try {
      setLoading(true);
      const res = await adminTierService.getTiers();
      setTiers(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      ...form,
      minPoints: Number(form.minPoints),
      discountPercent: Number(form.discountPercent),
    };

    if (selectedTier) {
      await adminTierService.updateTier(selectedTier.id, payload);
    } else {
      await adminTierService.createTier(payload);
    }

    setOpenModal(false);
    await fetchTiers();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Quản lý hạng thành viên
            </h2>
            <p className="text-sm text-slate-500 mt-1">Configure point requirements and tier benefits</p>
          </div>
          <button 
            onClick={() => { setSelectedTier(null); setOpenModal(true); }}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Tier
          </button>
        </div>

        <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50 border-b border-slate-200">
                <tr className="divide-x divide-slate-200">
                  <th className="px-6 py-5">TIER NAME</th>
                  <th className="px-6 py-5">MIN POINTS</th>
                  <th className="px-6 py-5">DISCOUNT (%)</th>
                  <th className="px-6 py-5">BENEFITS</th>
                  <th className="px-6 py-5 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">Đang tải dữ liệu...</td>
                  </tr>
                ) : tiers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">stars</span>
                        <p>No tiers configured</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tiers.map((item) => {
                    const name = item.tierName || item.name || 'MEMBER';
                    const style = TIER_ICONS[name.toUpperCase()] || TIER_ICONS.MEMBER;
                    const id = item.tierID || item.id;
                    const minPoints = item.minSpending || item.minPoints || 0;
                    const discount = item.discountRate || item.discountPercent || 0;
                    const benefits = item.benefits || 'Standard benefits';
                    
                    return (
                      <tr key={id} className="hover:bg-slate-50 transition-colors divide-x divide-slate-100">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${style.bg} ${style.color}`}>
                              <span className="material-symbols-outlined text-[20px]">{style.icon}</span>
                            </div>
                            <span className="font-bold text-slate-800 tracking-wide">{name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800">{Number(minPoints).toLocaleString()} pts</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                            {discount}% OFF
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 max-w-sm truncate" title={benefits}>
                          {benefits}
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
                            <button 
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
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
}