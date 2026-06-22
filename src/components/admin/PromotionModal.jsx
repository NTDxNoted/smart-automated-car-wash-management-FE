import React, { useEffect, useState } from 'react';

const PromotionModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form, setForm] = useState({
    title: '',
    promoCode: '',
    minTier: '',
    discountType: '',
    value: '',
    maxUsage: '',
    startDate: '',
    endDate: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        title: '',
        promoCode: '',
        minTier: '',
        discountType: '',
        value: '',
        maxUsage: '',
        startDate: '',
        endDate: '',
      });
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
      setError('Value phải là số dương.');
      return;
    }

    if (form.discountType === 'PERCENT' && value > 100) {
      setError('Giảm giá phần trăm không được vượt quá 100%.');
      return;
    }

    if (!Number.isFinite(maxUsage) || maxUsage < 0) {
      setError('MaxUsage phải là số không âm.');
      return;
    }

    onSubmit({
      ...form,
      value,
      maxUsage,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Promotion</h3>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />

        <input
          name="promoCode"
          placeholder="Promo Code"
          value={form.promoCode}
          onChange={handleChange}
        />

        <input
          name="minTier"
          placeholder="Min Tier"
          value={form.minTier}
          onChange={handleChange}
        />

        <select
          name="discountType"
          value={form.discountType}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="PERCENT">Percent</option>
          <option value="FIXED">Fixed</option>
        </select>

        <input
          name="value"
          type="number"
          value={form.value}
          onChange={handleChange}
          min="0"
          max={form.discountType === 'PERCENT' ? 100 : undefined}
        />

        <input
          name="maxUsage"
          type="number"
          value={form.maxUsage}
          onChange={handleChange}
          min="0"
        />

        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
        />

        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          min={form.startDate || undefined}
        />
        {error && <p style={{ color: '#f87171' }}>{error}</p>}
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;