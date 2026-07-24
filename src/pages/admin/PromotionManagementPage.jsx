import React, { useEffect, useState } from 'react';
import adminPromotionService from '../../services/adminPromotionService';
import PromotionModal from '../../components/admin/PromotionModal';
import './PromotionManagementPage.css';

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
    const tierMap = {
      'MEMBER': 1,
      'SILVER': 2,
      'GOLD': 3,
      'PLATINUM': 4
    };
    const mappedTierId = form.minTier ? (tierMap[form.minTier.toUpperCase()] || null) : null;

    const payload = {
      title: form.title,
      promoCode: form.promoCode,
      minTierId: mappedTierId,
      minTierID: mappedTierId,
      discountValue: Number(form.value),
      value: Number(form.value),
      maxUsage: form.maxUsage !== '' && form.maxUsage !== null && form.maxUsage !== undefined ? Number(form.maxUsage) : null,
      startDate: form.startDate,
      endDate: form.endDate,
      isActive: form.isActive !== undefined ? form.isActive : true,
      IsActive: form.isActive !== undefined ? form.isActive : true,
      minOrderValue: 0,
      MinOrderValue: 0,
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
    if (!tier) return <span className="text-slate-400">-</span>;
    const tierName = String(tier);
    switch (tierName.toUpperCase()) {
      case "PLATINUM":
        return <span className="promo-tier-badge platinum">{tierName}</span>;
      case "GOLD":
        return <span className="promo-tier-badge gold">{tierName}</span>;
      case "SILVER":
        return <span className="promo-tier-badge silver">{tierName}</span>;
      default:
        return <span className="promo-tier-badge member">{tierName}</span>;
    }
  };

  const isPromoActive = (item) => {
    if (!item.isActive) return false;
    const now = new Date();
    const vnTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    const todayStr = vnTime.toISOString().split('T')[0];
    
    if (item.startDate) {
      const startStr = item.startDate.split('T')[0];
      if (todayStr < startStr) return false;
    }
    
    if (item.endDate) {
      const endStr = item.endDate.split('T')[0];
      if (todayStr > endStr) return false;
    }
    
    return true;
  };

  return (
    <div className="promo-page-container">
      {/* Page Subtitle */}
      <div className="promo-page-subtitle"></div>

      {/* Promotions List Card */}
      <div className="promo-data-card">
        {/* Card Header */}
        <div className="promo-card-header">
          <h3 className="promo-card-title">Quản lý khuyến mãi</h3>

          <button
            onClick={handleCreate}
            className="promo-add-btn"
          >
            <span>+</span> Thêm khuyến mãi
          </button>
        </div>

        {/* Card Body / Table Wrapper */}
        <div className="promo-table-wrapper">
          <table className="promo-table">
            <thead>
              <tr className="promo-thead-row">
                <th className="promo-th name">Tên ưu đãi</th>
                <th className="promo-th code">Mã ưu đãi</th>
                <th className="promo-th tier">Hạng áp dụng</th>
                <th className="promo-th type">Loại giảm</th>
                <th className="promo-th value">Mức giảm</th>
                <th className="promo-th limit">Giới hạn</th>
                <th className="promo-th status">Trạng thái</th>
                <th className="promo-th action">Tác vụ</th>
              </tr>
            </thead>

            <tbody>
              {promotions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-0 border-none">
                    <div className="promo-empty-row">
                      <div className="promo-empty-container">
                        {/* Folder/Box SVG */}
                        <svg className="promo-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                        <div className="promo-empty-margin">
                          <div className="promo-empty-text-wrapper">
                            <span className="promo-empty-text">No promotions found.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                promotions.map((item) => (
                  <tr
                    key={item.id}
                    className="promo-tbody-row"
                  >
                    <td className="promo-td name">
                      <span className="promo-name-text" title={item.title}>{item.title}</span>
                    </td>

                    <td className="promo-td code">
                      <span className="promo-code-badge">{item.promoCode}</span>
                    </td>

                    <td className="promo-td tier">
                      {getTierDisplayBadge(item.minTier)}
                    </td>

                    <td className="promo-td type">
                      <span className="promo-type-text">
                        {String(item.discountType || '').toUpperCase().includes('PERCENT') ? 'Phần trăm' : 'Tiền mặt'}
                      </span>
                    </td>

                    <td className="promo-td value">
                      <span className="promo-value-text">
                        {String(item.discountType || '').toUpperCase().includes('PERCENT') ? `${item.value}%` : `${item.value?.toLocaleString()}đ`}
                      </span>
                    </td>

                    <td className="promo-td limit">
                      <span className="promo-limit-text">
                        {item.maxUsage?.toLocaleString() || 'Không giới hạn'}
                      </span>
                    </td>

                    <td className="promo-td status">
                      <button
                        type="button"
                        onClick={() => handleToggle(item)}
                        disabled={togglingIds.includes(item.id)}
                        className={`promo-status-capsule ${isPromoActive(item) ? 'active' : 'inactive'}`}
                        title="Click để đổi trạng thái thủ công"
                      >
                        {isPromoActive(item) ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                      </button>
                    </td>

                    <td className="promo-td action">
                      <button
                        onClick={() => handleEdit(item)}
                        className="promo-action-btn edit"
                      >
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))
              )}
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