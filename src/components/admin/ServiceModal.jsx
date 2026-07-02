import React, { useEffect, useState } from 'react';
import './ServiceModal.css';

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

    if (!form.name.trim()) {
      setError('Tên dịch vụ không được để trống.');
      return;
    }

    if (!form.category) {
      setError('Vui lòng chọn phân loại dịch vụ.');
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError('Đơn giá phải là số nguyên dương hợp lệ.');
      return;
    }

    if (!Number.isFinite(duration) || duration <= 0) {
      setError('Thời gian hoàn thành phải là số dương hợp lệ.');
      return;
    }

    onSubmit({
      ...form,
      price,
      duration,
    });
  };

  return (
    <div className="service-modal-overlay">
      <div className="service-modal-container">

        {/* Modal Header */}
        <div className="service-modal-header">
          <h3 className="service-modal-title">
            {initialData ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}
          </h3>
        </div>

        {/* Modal Body */}
        <div className="service-modal-body">
          <div className="service-modal-form">

            {/* Form Grid */}
            <div className="service-modal-grid">

              {/* Tên dịch vụ */}
              <div className="service-modal-field">
                <label className="service-modal-label">Tên dịch vụ</label>
                <input
                  name="name"
                  placeholder="Tên dịch vụ..."
                  value={form.name}
                  onChange={handleChange}
                  className="service-modal-input"
                />
              </div>

              {/* Phân loại */}
              <div className="service-modal-field">
                <label className="service-modal-label">Phân loại</label>
                <div className="service-modal-select-wrapper">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="service-modal-select"
                  >
                    <option value="">Chọn phân loại...</option>
                    <option value="Rửa xe">Rửa xe</option>
                    <option value="Chăm sóc">Chăm sóc</option>
                    <option value="Khác">Khác</option>
                  </select>
                  <svg className="service-modal-select-chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Đơn giá */}
              <div className="service-modal-field">
                <label className="service-modal-label">Đơn giá</label>
                <input
                  name="price"
                  type="number"
                  placeholder="Nhập đơn giá..."
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  className="service-modal-input"
                />
              </div>

              {/* Thời gian */}
              <div className="service-modal-field">
                <label className="service-modal-label">Thời gian (phút)</label>
                <input
                  name="duration"
                  type="number"
                  placeholder="Nhập thời gian hoàn thành..."
                  value={form.duration}
                  onChange={handleChange}
                  min="1"
                  className="service-modal-input"
                />
              </div>

            </div>

            {/* Mô tả */}
            <div className="service-modal-field">
              <label className="service-modal-label">Mô tả</label>
              <textarea
                name="description"
                placeholder="Nhập mô tả chi tiết dịch vụ..."
                value={form.description}
                onChange={handleChange}
                className="service-modal-textarea"
              />
            </div>

            {/* Trạng thái hoạt động */}
            <div className="service-modal-status-row">
              <span className="service-modal-status-label">Trạng thái hoạt động:</span>
              <label className="service-modal-checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={form.status === 'Active'}
                  onChange={(e) => setForm({ ...form, status: e.target.checked ? 'Active' : 'Inactive' })}
                  className="service-modal-checkbox-input"
                />
                <span className={`service-modal-status-text ${form.status === 'Active' ? 'active' : 'inactive'}`}>
                  Active
                </span>
              </label>
            </div>

            {error && <p className="service-modal-error">{error}</p>}

            {/* Modal Actions */}
            <div className="service-modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="service-modal-btn cancel"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="service-modal-btn save"
              >
                Lưu thay đổi
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ServiceModal;