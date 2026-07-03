import React, { useEffect, useState } from 'react';
import './TierModal.css';

const defaultForm = {
  name: '',
  minSpending: '',
  discountRate: '',
  bookingWindowDays: '',
};

const TierModal = ({
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
        name: initialData.name || '',
        minSpending: initialData.minSpending ?? '',
        discountRate: initialData.discountRate ?? '',
        bookingWindowDays: initialData.bookingWindowDays ?? '',
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
    const minSpending = Number(form.minSpending);
    const discountRate = Number(form.discountRate);
    const bookingWindowDays = Number(form.bookingWindowDays);

    if (!Number.isFinite(minSpending) || minSpending < 0) {
      setError('Chi tiêu tối thiểu phải là số không âm.');
      return;
    }

    if (!Number.isFinite(discountRate) || discountRate < 0 || discountRate > 100) {
      setError('Tỉ lệ giảm giá phải nằm trong khoảng từ 0% đến 100%.');
      return;
    }

    if (!Number.isInteger(bookingWindowDays) || bookingWindowDays <= 0) {
      setError('Thời hạn đặt lịch tối đa phải là số nguyên dương.');
      return;
    }

    onSubmit({
      ...form,
      minSpending,
      discountRate,
      bookingWindowDays,
    });
  };

  return (
    <div className="tier-modal-overlay">
      <div className="tier-modal-container">

        {/* Header */}
        <div className="tier-modal-header">
          <h2 className="tier-modal-title">
            Cập nhật cấu hình hạng: {form.name}
          </h2>
        </div>

        {/* Body */}
        <div className="tier-modal-body">
          <form className="tier-modal-form" onSubmit={(e) => e.preventDefault()}>

            {/* Grid 1: Tier Name (Disabled) & Min Spending */}
            <div className="tier-modal-grid">
              <div className="tier-modal-field">
                <label className="tier-modal-label">Tên hạng thành viên</label>
                <input
                  name="name"
                  value={form.name}
                  disabled
                  className="tier-modal-input"
                />
              </div>

              <div className="tier-modal-field">
                <label className="tier-modal-label">Chi tiêu tối thiểu (VNĐ)</label>
                <input
                  name="minSpending"
                  type="number"
                  placeholder="Ví dụ: 5000000"
                  value={form.minSpending}
                  onChange={handleChange}
                  className="tier-modal-input"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Grid 2: Discount Rate & Booking Window Days */}
            <div className="tier-modal-grid">
              <div className="tier-modal-field">
                <label className="tier-modal-label">Ưu đãi giảm giá (%)</label>
                <input
                  name="discountRate"
                  type="number"
                  placeholder="Ví dụ: 10"
                  value={form.discountRate}
                  onChange={handleChange}
                  className="tier-modal-input"
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div className="tier-modal-field">
                <label className="tier-modal-label">Số lần booking (ngày)</label>
                <input
                  name="bookingWindowDays"
                  type="number"
                  placeholder="Ví dụ: 7"
                  value={form.bookingWindowDays}
                  onChange={handleChange}
                  className="tier-modal-input"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="tier-modal-error">{error}</div>}

            {/* Footer Actions */}
            <div className="tier-modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="tier-modal-btn cancel"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="tier-modal-btn save"
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

export default TierModal;