import React, { useEffect, useState } from 'react';

const TierModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [form, setForm] = useState({
    minSpending: '',
    discountRate: '',
    bookingWindowDays: '',
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
        <h3>Edit Tier</h3>

        <input
          name="minSpending"
          value={form.minSpending}
          onChange={handleChange}
          placeholder="Min Spending"
        />

        <input
          name="discountRate"
          value={form.discountRate}
          onChange={handleChange}
          placeholder="Discount Rate"
        />

        <input
          name="bookingWindowDays"
          value={form.bookingWindowDays}
          onChange={handleChange}
          placeholder="Booking Window Days"
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={() => onSubmit(form)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TierModal;