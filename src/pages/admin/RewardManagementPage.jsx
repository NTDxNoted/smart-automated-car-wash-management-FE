import { useEffect, useRef, useState } from 'react';
import adminRewardService from '../../services/adminRewardService';
import RewardModal from '../../components/admin/RewardModal';
import './RewardManagementPage.css';

const RewardManagementPage = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [togglingIds, setTogglingIds] = useState([]);
  const [deletingIds, setDeletingIds] = useState([]);

  const fetchRewards = async () => {
    setLoading(true);
    setFetchError(null);
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
      setFetchError(err?.response?.data?.message || "Không thể tải danh sách voucher đổi điểm. Vui lòng kiểm tra kết nối Server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      if (isSubscribed) {
        await fetchRewards();
      }
    })();
    return () => {
      isSubscribed = false;
    };
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
      alert(err?.response?.data?.message || "Không thể lưu voucher đổi điểm. Vui lòng kiểm tra kết nối Backend.");
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

  const handleDelete = async (reward) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa voucher "${reward.rewardName}" không?`);
    if (!confirmed) return;

    if (deletingIds.includes(reward.id)) return;
    setDeletingIds((prev) => [...prev, reward.id]);

    try {
      await adminRewardService.deleteReward(reward.id);
      await fetchRewards();
    } catch (err) {
      console.error("Lỗi khi xóa voucher:", err);
      alert(err?.response?.data?.message || "Không thể xóa voucher đổi điểm.");
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== reward.id));
    }
  };

  return (
    <div className="reward-page-container">
      {/* Subtitle / Description */}
      <div className="reward-page-subtitle">
        Quản lý danh mục các gói Voucher đổi điểm tích lũy thành viên của khách hàng.
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
                  <td colSpan={6} className="p-0 border-none">
                    <div className="reward-empty-row">
                      <div className="reward-empty-container">
                        <span className="text-slate-400 font-medium">Đang tải danh sách voucher đổi điểm...</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : fetchError ? (
                <tr>
                  <td colSpan={6} className="p-0 border-none">
                    <div className="reward-empty-row py-8">
                      <div className="reward-empty-container flex flex-col items-center gap-3">
                        <span className="text-rose-500 font-semibold text-sm text-center px-4">{fetchError}</span>
                        <button
                          type="button"
                          onClick={fetchRewards}
                          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 mt-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                          </svg>
                          Thử lại
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : rewards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-0 border-none">
                    <div className="reward-empty-row">
                      <div className="reward-empty-container">
                        <svg className="reward-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="9" />
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
                        <div className="reward-action-group">
                          <button
                            onClick={() => handleEdit(item)}
                            className="reward-action-btn edit"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            disabled={deletingIds.includes(item.id)}
                            className="reward-action-btn delete"
                          >
                            Xóa
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
