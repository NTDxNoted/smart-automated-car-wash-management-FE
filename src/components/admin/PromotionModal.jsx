import React, { useEffect, useState } from 'react';
import './PromotionModal.css';

const defaultForm = {
  title: '',
  promoCode: '',
  minTier: '',
  discountType: '',
  value: '',
  maxUsage: '',
  startDate: '',
  endDate: '',
  isActive: true,
};

const formatDateForInput = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.slice(0, 10);
};

const PromotionModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        ...defaultForm,
        ...initialData,
        startDate: formatDateForInput(initialData.startDate),
        endDate: formatDateForInput(initialData.endDate),
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      });
    } else {
      setForm(defaultForm);
    }
    setError('');
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    const value = Number(form.value);
    const maxUsage = Number(form.maxUsage);

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      setError('EndDate không được nhỏ hơn StartDate.');
      return;
    }

    if (!Number.isFinite(value) || value <= 0) {
      setError('Mức giảm phải là số dương.');
      return;
    }

    if (form.discountType === 'PERCENT' && value > 100) {
      setError('Giảm giá phần trăm không được vượt quá 100%.');
      return;
    }

    if (form.maxUsage !== '' && form.maxUsage !== null && form.maxUsage !== undefined) {
      if (!Number.isFinite(maxUsage) || maxUsage < 0) {
        setError('Giới hạn phải là số không âm.');
        return;
      }
    }

    onSubmit({
      ...form,
      value,
      maxUsage,
    });
  };

  return (
    <div className="promo-modal-overlay">
      <div className="promo-modal-container">
        
        {/* Header */}
        <div className="promo-modal-header">
          <h2 className="promo-modal-title">
            {initialData ? 'Cập nhật khuyến mãi' : 'Thêm khuyến mãi mới'}
          </h2>
        </div>

        {/* Body */}
        <div className="promo-modal-body">
          <form className="promo-modal-form" onSubmit={(e) => e.preventDefault()}>
            
            {/* Grid 1: Title & Promo Code */}
            <div className="promo-modal-grid">
              <div className="promo-modal-field">
                <label className="promo-modal-label">Tên ưu đãi</label>
                <input
                  name="title"
                  placeholder="Nhập tên chương trình ưu đãi"
                  value={form.title}
                  onChange={handleChange}
                  className="promo-modal-input"
                  required
                />
              </div>

              <div className="promo-modal-field">
                <label className="promo-modal-label">Mã ưu đãi</label>
                <input
                  name="promoCode"
                  placeholder="Nhập mã code (ví dụ: PROMO50)"
                  value={form.promoCode}
                  onChange={handleChange}
                  className="promo-modal-input"
                  required
                />
              </div>
            </div>

            {/* Grid 2: Min Tier & Discount Type */}
            <div className="promo-modal-grid">
              <div className="promo-modal-field">
                <label className="promo-modal-label">Hạng áp dụng</label>
                <div className="promo-modal-select-wrapper">
                  <select
                    name="minTier"
                    value={form.minTier}
                    onChange={handleChange}
                    className="promo-modal-select"
                  >
                    <option value="">Tất cả hạng (All tiers)</option>
                    <option value="MEMBER">Member</option>
                    <option value="SILVER">Silver</option>
                    <option value="GOLD">Gold</option>
                    <option value="PLATINUM">Platinum</option>
                  </select>
                  <svg className="promo-modal-select-chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="promo-modal-field">
                <label className="promo-modal-label">Loại giảm giá</label>
                <div className="promo-modal-select-wrapper">
                  <select
                    name="discountType"
                    value={form.discountType}
                    onChange={handleChange}
                    className="promo-modal-select"
                    required
                  >
                    <option value="">Chọn loại giảm giá</option>
                    <option value="PERCENT">Giảm phần trăm (%)</option>
                    <option value="FIXED">Giảm tiền mặt (đ)</option>
                  </select>
                  <svg className="promo-modal-select-chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Grid 3: Value & Max Usage */}
            <div className="promo-modal-grid">
              <div className="promo-modal-field">
                <label className="promo-modal-label">Mức giảm</label>
                <input
                  name="value"
                  type="number"
                  placeholder={form.discountType === 'PERCENT' ? 'Ví dụ: 15 (%)' : 'Ví dụ: 50000 (đ)'}
                  value={form.value}
                  onChange={handleChange}
                  className="promo-modal-input"
                  min="0"
                  max={form.discountType === 'PERCENT' ? 100 : undefined}
                  required
                />
              </div>

              <div className="promo-modal-field">
                <label className="promo-modal-label">Giới hạn lượt dùng</label>
                <input
                  name="maxUsage"
                  type="number"
                  placeholder="Ví dụ: 100 (để trống nếu không giới hạn)"
                  value={form.maxUsage}
                  onChange={handleChange}
                  className="promo-modal-input"
                  min="0"
                />
              </div>
            </div>

            {/* Grid 4: Start Date & End Date */}
            <div className="promo-modal-grid">
              <div className="promo-modal-field">
                <label className="promo-modal-label">Ngày bắt đầu</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="promo-modal-input"
                  required
                />
              </div>

              <div className="promo-modal-field">
                <label className="promo-modal-label">Ngày kết thúc</label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  min={form.startDate || undefined}
                  className="promo-modal-input"
                  required
                />
              </div>
            </div>

            {/* Status Checkbox Toggler */}
            <div className="promo-modal-status-row">
              <span className="promo-modal-status-label">Trạng thái hoạt động:</span>
              <label className="promo-modal-checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="promo-modal-checkbox-input"
                />
                <span className={`promo-modal-status-text ${form.isActive ? 'active' : 'inactive'}`}>
                  {form.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && <div className="promo-modal-error">{error}</div>}

            {/* Footer Actions */}
            <div className="promo-modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="promo-modal-btn cancel"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="promo-modal-btn save"
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

export default PromotionModal;