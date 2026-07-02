import React, { useEffect, useState } from 'react';
import AdminSwitch from './AdminSwitch';

const defaultForm = {
  name: '',
  category: '',
  price: '',
  duration: '',
  description: '',
  status: 'Active',
};

const ServiceModal = ({
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
    const price = Number(form.price);
    const duration = Number(form.duration);

    if (!Number.isFinite(price) || price < 0) {
      setError('Price must be a valid non-negative number.');
      return;
    }

    if (!Number.isFinite(duration) || duration <= 0) {
      setError('Duration must be a valid positive number.');
      return;
    }

    onSubmit({
      ...form,
      price,
      duration,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>
          {initialData ? 'Edit Service' : 'Create Service'}
        </h3>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          min="0"
        />

        <input
          name="duration"
          type="number"
          placeholder="Duration"
          value={form.duration}
          onChange={handleChange}
          min="1"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '14px 0' }}>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>Trạng thái hoạt động:</span>
          <AdminSwitch
            checked={form.status === 'Active'}
            onChange={(checked) => setForm({ ...form, status: checked ? 'Active' : 'Inactive' })}
          />
          <span style={{ color: form.status === 'Active' ? '#34d399' : '#f87171', fontSize: '14px', fontWeight: 'bold' }}>
            {form.status === 'Active' ? 'Active' : 'Inactive'}
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

export default ServiceModal;