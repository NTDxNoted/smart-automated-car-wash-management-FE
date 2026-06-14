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

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
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
        />

        <input
          name="maxUsage"
          type="number"
          value={form.maxUsage}
          onChange={handleChange}
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
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onSubmit(form)}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;