import React, { useEffect, useState } from 'react';
import AdminSwitch from './AdminSwitch';

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
          <option value="">Select Discount Type</option>
          <option value="PERCENT">Percent</option>
          <option value="FIXED">Fixed</option>
        </select>

        <input
          name="value"
          type="number"
          placeholder="Value"
          value={form.value}
          onChange={handleChange}
          min="0"
          max={form.discountType === 'PERCENT' ? 100 : undefined}
        />

        <input
          name="maxUsage"
          type="number"
          placeholder="Max Usage"
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '14px 0' }}>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>Trạng thái hoạt động:</span>
          <AdminSwitch
            checked={form.isActive}
            onChange={(checked) => setForm({ ...form, isActive: checked })}
          />
          <span style={{ color: form.isActive ? '#34d399' : '#f87171', fontSize: '14px', fontWeight: 'bold' }}>
            {form.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {error && <p style={{ color: '#f87171' }}>{error}</p>}
        
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;