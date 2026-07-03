import React, { useEffect, useState } from 'react';
import adminTierService from '../../services/adminTierService';
import TierModal from '../../components/admin/TierModal';
import './TierConfigPage.css';

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

  const renderTierIcon = (name) => {
    const norm = name?.toUpperCase() || '';
    if (norm === 'PLATINUM') {
      return (
        <div className="tier-icon-box platinum">
          <svg className="tier-svg platinum" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M6 3h12l4 6-10 13L2 9z" />
            <path d="M11 3 8 9l4 13 4-13-3-6" />
            <path d="M2 9h20" />
          </svg>
        </div>
      );
    }
    if (norm === 'GOLD') {
      return (
        <div className="tier-icon-box gold">
          <svg className="tier-svg gold" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      );
    }
    if (norm === 'SILVER') {
      return (
        <div className="tier-icon-box silver">
          <svg className="tier-svg silver" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="tier-icon-box member">
        <svg className="tier-svg member" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    );
  };

  return (
    <div className="tier-page-container">
      {/* Page Subtitle */}
      <div className="tier-page-subtitle"></div>

      {/* Tier Config Table Card */}
      <div className="tier-data-card">
        {/* Card Header */}
        <div className="tier-card-header">
          <h3 className="tier-card-title">Cấu hình hạng thành viên</h3>

          <button
            onClick={() => alert("Tính năng này hiện tại được cấu hình tự động thông qua hệ thống phân hạng mặc định.")}
            className="tier-add-btn"
          >
            <span>+</span> Thêm hạng mới
          </button>
        </div>

        {/* Card Body / Table Wrapper */}
        <div className="tier-table-wrapper">
          <table className="tier-table">
            <thead>
              <tr className="tier-thead-row">
                <th className="tier-th name">Tên hạng</th>
                <th className="tier-th spending">Chi tiêu tối thiểu</th>
                <th className="tier-th discount">Ưu đãi giảm giá (%)</th>
                <th className="tier-th window">Số lần booking</th>
                <th className="tier-th action">Tác vụ</th>
              </tr>
            </thead>

            <tbody>
              {tiers.map((tier) => (
                <tr
                  key={tier.id}
                  className="tier-tbody-row"
                >
                  <td className="tier-td name">
                    {renderTierIcon(tier.name)}
                    <span className="tier-name-text">{tier.name}</span>
                  </td>

                  <td className="tier-td spending">
                    <span className="tier-spending-text">
                      {tier.minSpending?.toLocaleString()}
                    </span>
                  </td>

                  <td className="tier-td discount">
                    <span className="tier-discount-text">
                      {tier.discountRate}%
                    </span>
                  </td>

                  <td className="tier-td window">
                    <span className="tier-window-text">
                      {tier.bookingWindowDays}
                    </span>
                  </td>

                  <td className="tier-td action">
                    <button
                      onClick={() => handleEdit(tier)}
                      className="tier-edit-btn"
                      title="Chỉnh sửa cấu hình hạng"
                    >
                      <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card Footer */}
        <div className="tier-card-footer">
          <span className="tier-footer-text">
            Showing {tiers.length} tiers
          </span>
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