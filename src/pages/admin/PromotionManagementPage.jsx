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

  const thStyle = {
    textAlign: "left",
    padding: "14px 18px",
    color: "#38bdf8",
    borderBottom: "1px solid #334155",
    fontWeight: 700,
  };

  const tdStyle = {
    padding: "16px 18px",
    color: "#e2e8f0",
    borderBottom: "1px solid #1e293b",
  };

  const buttonStyle = {
    background: "#0ea5e9",
    border: "none",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Promotion Management</h2>
      </div>

      <div
        style={{
          background: "#07111f",
          border: "1px solid #1e293b",
          borderRadius: "12px",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ color: "#fff", fontSize: "20px", margin: 0 }}>
            Quản lý khuyến mãi
          </h3>

          <button onClick={handleCreate} style={buttonStyle}>
            + Add Promotion
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Promo Code</th>
              <th style={thStyle}>Min Tier</th>
              <th style={thStyle}>Discount Type</th>
              <th style={thStyle}>Value</th>
              <th style={thStyle}>Max Usage</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {promotions.map((item) => (
              <tr key={item.id}>
                <td style={tdStyle}>{item.title}</td>
                <td style={tdStyle}>{item.promoCode}</td>
                <td style={tdStyle}>{item.minTier}</td>
                <td style={tdStyle}>{item.discountType}</td>
                <td style={tdStyle}>{item.value}</td>
                <td style={tdStyle}>{item.maxUsage}</td>
                <td style={tdStyle}>
                  <AdminSwitch
                    checked={item.isActive}
                    loading={togglingIds.includes(item.id)}
                    disabled={togglingIds.includes(item.id)}
                    onChange={() => handleToggle(item)}
                  />
                </td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(item)} style={buttonStyle}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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