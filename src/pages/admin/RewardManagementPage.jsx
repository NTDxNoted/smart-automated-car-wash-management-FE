import React, { useEffect, useState } from 'react';
import adminRewardService from '../../services/adminRewardService';
import RewardModal from '../../components/admin/RewardModal';
import './RewardManagementPage.css';

const RewardManagementPage = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [togglingIds, setTogglingIds] = useState([]);
  const [notice, setNotice] = useState('');

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const res = await adminRewardService.getRewards();
      const rawList = res.data?.data || res.data || [];
      const mapped = rawList.map(item => {
        let dType = item.discountType ?? item.DiscountType ?? 'Fixed_Amount';
        if (dType === 'Percentage') dType = 'PERCENT';
        if (dType === 'Fixed_Amount') dType = 'FIXED';

        return {
          id: item.rewardId ?? item.rewardID ?? item.RewardID ?? item.id,
          rewardName: item.rewardName ?? item.RewardName ?? item.name,
          description: item.description ?? item.Description ?? '',
          pointsRequired: item.pointsRequired ?? item.PointsRequired ?? 0,
          discountType: dType,
          discountAmount: item.discountAmount ?? item.DiscountAmount ?? item.discountValue ?? 0,
          isActive: item.isActive !== undefined ? item.isActive : (item.IsActive !== undefined ? item.IsActive : true),
        };
      });
      setRewards(mapped);
    } catch (err) {
      console.error("Lỗi khi tải danh sách voucher đổi điểm:", err);
      setRewards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleCreate = () => {
    setSelectedReward(null);
    setOpenModal(true);
  };

  const handleEdit = (reward) => {
    setSelectedReward(reward);
    setOpenModal(true);
  };

  const handleSubmit = async (form) => {
    const payload = {
      rewardName: form.rewardName,
      RewardName: form.rewardName,
      description: form.description,
      Description: form.description,
      pointsRequired: Number(form.pointsRequired),
      PointsRequired: Number(form.pointsRequired),
      discountType: form.discountType,
      DiscountType: form.discountType,
      discountAmount: Number(form.discountAmount),
      DiscountAmount: Number(form.discountAmount),
    };

    try {
      if (selectedReward) {
        await adminRewardService.updateReward(selectedReward.id, payload);
      } else {
        await adminRewardService.createReward(payload);
      }
      setOpenModal(false);
      await fetchRewards();
    } catch (err) {
      console.error("Lỗi khi lưu voucher đổi điểm:", err);
      alert(err?.response?.data?.message || "Không thể lưu voucher đổi điểm. Vui lòng kiểm tra lại kết nối Backend.");
    }
  };

  const handleToggle = async (reward) => {
    if (togglingIds.includes(reward.id)) return;

    setTogglingIds((prev) => [...prev, reward.id]);

    try {
      await adminRewardService.toggleReward(reward.id);
      await fetchRewards();
    } catch (err) {
      console.error("Lỗi khi đổi trạng thái voucher:", err);
      alert(err?.response?.data?.message || "Không thể thay đổi trạng thái voucher.");
    } finally {
      setTogglingIds((prev) => prev.filter((id) => id !== reward.id));
    }
  };

  return (
    <div className="reward-page-container">
      {/* Subtitle / Description */}
      <div className="reward-page-subtitle">
        Quản lý danh mục các gói Voucher & Phần thưởng đổi bằng điểm tích lũy thành viên của khách hàng.
      </div>

      {/* Rewards List Card */}
      <div className="reward-data-card">
        {/* Card Header */}
        <div className="reward-card-header">
          <h3 className="reward-card-title">Quản lý voucher đổi điểm</h3>

          <button
            onClick={handleCreate}
            className="reward-add-btn"
          >
            <span>+</span> Thêm voucher điểm
          </button>
        </div>

        {/* Card Body / Table Wrapper */}
        <div className="reward-table-wrapper">
          <table className="reward-table">
            <thead>
              <tr className="reward-thead-row">
                <th className="reward-th name">Tên voucher</th>
                <th className="reward-th desc">Mô tả quà tặng</th>
                <th className="reward-th points">Điểm cần đổi</th>
                <th className="reward-th type">Loại giảm</th>
                <th className="reward-th value">Mức giảm</th>
                <th className="reward-th status">Trạng thái</th>
                <th className="reward-th action">Tác vụ</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-0 border-none">
                    <div className="reward-empty-row">
                      <div className="reward-empty-container">
                        <span className="text-slate-400 font-medium">Đang tải danh sách voucher đổi điểm...</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : rewards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-0 border-none">
                    <div className="reward-empty-row">
                      <div className="reward-empty-container">
                        <svg className="reward-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 12vA8 8 0 0 0 4 12v0a8 8 0 0 0 16 0z" />
                          <polygon points="12 8 13.9 11.9 18.2 12.5 15.1 15.6 15.8 19.9 12 17.9 8.2 19.9 8.9 15.6 5.8 12.5 10.1 11.9" />
                        </svg>
                        <div className="reward-empty-margin">
                          <div className="reward-empty-text-wrapper">
                            <span className="reward-empty-text">Chưa có phần thưởng / voucher đổi điểm nào trong hệ thống.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                rewards.map((item) => {
                  const isPercent = String(item.discountType || '').toUpperCase().includes('PERCENT');
                  return (
                    <tr key={item.id} className="reward-tbody-row">
                      <td className="reward-td name">
                        <span className="reward-name-text" title={item.rewardName}>{item.rewardName}</span>
                      </td>

                      <td className="reward-td desc">
                        <span className="reward-desc-text" title={item.description}>{item.description}</span>
                      </td>

                      <td className="reward-td points">
                        <span className="reward-points-badge">{item.pointsRequired?.toLocaleString()} PTS</span>
                      </td>

                      <td className="reward-td type">
                        <span className="reward-type-text">
                          {isPercent ? 'Phần trăm' : 'Tiền mặt'}
                        </span>
                      </td>

                      <td className="reward-td value">
                        <span className="reward-value-text">
                          {isPercent ? `${item.discountAmount}%` : `${item.discountAmount?.toLocaleString()}đ`}
                        </span>
                      </td>

                      <td className="reward-td status">
                        <button
                          type="button"
                          onClick={() => handleToggle(item)}
                          disabled={togglingIds.includes(item.id)}
                          className={`reward-status-capsule ${item.isActive ? 'active' : 'inactive'}`}
                          title="Click để đổi trạng thái thủ công"
                        >
                          {item.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                        </button>
                      </td>

                      <td className="reward-td action">
                        <button
                          onClick={() => handleEdit(item)}
                          className="reward-action-btn edit"
                        >
                          Sửa
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RewardModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        initialData={selectedReward}
      />
    </div>
  );
};

export default RewardManagementPage;
