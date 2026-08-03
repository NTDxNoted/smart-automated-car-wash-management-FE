import React, { useEffect, useState } from 'react';
import './RewardModal.css';

const defaultForm = {
  rewardName: '',
  description: '',
  pointsRequired: '',
  discountType: 'Fixed_Amount',
  discountAmount: '',
};

const RewardModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      let dType = initialData.discountType || initialData.DiscountType || 'Fixed_Amount';
      if (dType === 'FIXED' || dType === 'Fixed_Amount') dType = 'Fixed_Amount';
      if (dType === 'PERCENT' || dType === 'Percentage') dType = 'Percentage';

      setForm({
        rewardName: initialData.rewardName || initialData.RewardName || initialData.name || '',
        description: initialData.description || initialData.Description || '',
        pointsRequired: initialData.pointsRequired !== undefined && initialData.pointsRequired !== null ? initialData.pointsRequired : '',
        discountType: dType,
        discountAmount: initialData.discountAmount !== undefined && initialData.discountAmount !== null
          ? initialData.discountAmount
          : (initialData.discountValue !== undefined ? initialData.discountValue : ''),
      });
    } else {
      setForm(defaultForm);
    }
    setError('');
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (!form.rewardName.trim()) {
      setError('Vui lòng nhập tên phần thưởng / voucher.');
      return;
    }

    if (!form.description.trim()) {
      setError('Vui lòng nhập mô tả phần thưởng.');
      return;
    }

    const pts = Number(form.pointsRequired);
    if (!Number.isFinite(pts) || pts <= 0) {
      setError('Số điểm đổi phải là số nguyên dương.');
      return;
    }

    const amt = Number(form.discountAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      setError('Mức giảm giá phải lớn hơn 0.');
      return;
    }

    if (form.discountType === 'Percentage' && amt > 100) {
      setError('Giảm giá phần trăm không được vượt quá 100%.');
      return;
    }

    onSubmit({
      rewardName: form.rewardName.trim(),
      description: form.description.trim(),
      pointsRequired: Math.floor(pts),
      discountType: form.discountType,
      discountAmount: amt,
    });
  };

  return (
    <div className="reward-modal-overlay">
      <div className="reward-modal-container">
        
        {/* Header */}
        <div className="reward-modal-header">
          <h2 className="reward-modal-title">
            {initialData ? 'Cập nhật voucher đổi điểm' : 'Thêm voucher đổi điểm mới'}
          </h2>
        </div>

        {/* Body */}
        <div className="reward-modal-body">
          <form className="reward-modal-form" onSubmit={(e) => e.preventDefault()}>
            
            {/* Grid 1: Reward Name & Points Required */}
            <div className="reward-modal-grid">
              <div className="reward-modal-field">
                <label className="reward-modal-label">Tên voucher / Phần thưởng</label>
                <input
                  name="rewardName"
                  placeholder="Ví dụ: Gói giảm giá 50K"
                  value={form.rewardName}
                  onChange={handleChange}
                  className="reward-modal-input"
                  required
                />
              </div>

              <div className="reward-modal-field">
                <label className="reward-modal-label">Điểm cần đổi (Points)</label>
                <input
                  name="pointsRequired"
                  type="number"
                  placeholder="Ví dụ: 50 (điểm)"
                  value={form.pointsRequired}
                  onChange={handleChange}
                  className="reward-modal-input"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Grid 2: Description (Full width) */}
            <div className="reward-modal-field">
              <label className="reward-modal-label">Mô tả quà tặng / Điều kiện áp dụng</label>
              <input
                name="description"
                placeholder="Ví dụ: Đổi 50 điểm lấy voucher giảm 50.000đ khi thanh toán đơn rửa xe"
                value={form.description}
                onChange={handleChange}
                className="reward-modal-input"
                required
              />
            </div>

            {/* Grid 3: Discount Type & Discount Amount */}
            <div className="reward-modal-grid">
              <div className="reward-modal-field">
                <label className="reward-modal-label">Loại giảm giá</label>
                <div className="reward-modal-select-wrapper">
                  <select
                    name="discountType"
                    value={form.discountType}
                    onChange={handleChange}
                    className="reward-modal-select"
                    required
                  >
                    <option value="Fixed_Amount">Giảm tiền mặt (đ)</option>
                    <option value="Percentage">Giảm phần trăm (%)</option>
                  </select>
                  <svg className="reward-modal-select-chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="reward-modal-field">
                <label className="reward-modal-label">Mức giảm giá</label>
                <input
                  name="discountAmount"
                  type="number"
                  placeholder={form.discountType === 'Percentage' ? 'Ví dụ: 10 (%)' : 'Ví dụ: 50000 (đ)'}
                  value={form.discountAmount}
                  onChange={handleChange}
                  className="reward-modal-input"
                  min="0"
                  max={form.discountType === 'Percentage' ? 100 : undefined}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="reward-modal-error">{error}</div>}

            {/* Footer Actions */}
            <div className="reward-modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="reward-modal-btn cancel"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="reward-modal-btn save"
              >
                Lưu
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default RewardModal;
