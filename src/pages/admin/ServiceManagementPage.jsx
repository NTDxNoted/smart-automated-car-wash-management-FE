import React, { useEffect, useState } from 'react';
import adminServiceService from '../../services/adminServiceService';
import ServiceModal from '../../components/admin/ServiceModal';

const ServiceManagementPage = () => {
  const [services, setServices] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const fetchServices = async () => {
    try {
      const res = await adminServiceService.getAdminServices();
      const rawList = res.data?.data || res.data || [];
      const mapped = rawList.map(item => ({
        id: item.serviceId ?? item.serviceID ?? item.id,
        name: item.serviceName ?? item.name,
        category: item.serviceCategory ?? item.category,
        price: item.price,
        duration: item.duration,
        description: item.description,
        status: item.status,
      }));
      setServices(mapped);
    } catch (err) {
      console.error("Fetch services error:", err);
      setServices([]);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreate = () => {
    setSelectedService(null);
    setOpenModal(true);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setOpenModal(true);
  };

  const handleSubmit = async (form) => {
    const payload = {
      serviceName: form.name,
      serviceCategory: form.category,
      price: Number(form.price),
      duration: Number(form.duration),
      description: form.description,
    };

    if (selectedService) {
      const oldPrice = Number(selectedService.price);
      const newPrice = Number(payload.price);

      const isPriceChanged =
        Number.isFinite(oldPrice) &&
        Number.isFinite(newPrice) &&
        oldPrice !== newPrice;

      if (isPriceChanged) {
        const confirmed = window.confirm(
          'Giá dịch vụ đã thay đổi. Giá mới chỉ áp dụng cho booking mới. Bạn có chắc muốn lưu thay đổi này không?'
        );

        if (!confirmed) return;
      }

      await adminServiceService.updateService(selectedService.id, payload);
    } else {
      await adminServiceService.createService(payload);
    }

    setOpenModal(false);
    await fetchServices();
  };

  const thStyle = {
  textAlign: "left",
  padding: "14px 18px",
  color: "#38bdf8",
  borderBottom: "1px solid #334155",
  fontWeight: 700,
};

const tdStyle = {
  padding: "16px 18px",
  color: "#e2e8f0",
  borderBottom: "1px solid #1e293b",
};

const buttonStyle = {
  background: "#0ea5e9",
  border: "none",
  color: "#fff",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
};

  return (
  <div className="admin-page">
    <div className="admin-page-header">
      <h2>Service Management</h2>
    </div>

    <div
      style={{
        background: "#07111f",
        border: "1px solid #1e293b",
        borderRadius: "12px",
        padding: "20px",
        marginTop: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ color: "#fff", fontSize: "20px", margin: 0 }}>
          Quản lý dịch vụ
        </h3>

        <button onClick={handleCreate} style={buttonStyle}>
          + Add Service
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Duration</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>

        <tbody>
          {services.map((item) => (
            <tr key={item.id}>
              <td style={tdStyle}>{item.name}</td>
              <td style={tdStyle}>{item.category}</td>
              <td style={tdStyle}>{Number(item.price).toLocaleString()}đ</td>
              <td style={tdStyle}>{item.duration} phút</td>
              <td style={tdStyle}>{item.description}</td>
              <td style={tdStyle}>
                <button onClick={() => handleEdit(item)} style={buttonStyle}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <ServiceModal
      open={openModal}
      onClose={() => setOpenModal(false)}
      onSubmit={handleSubmit}
      initialData={selectedService}
    />
  </div>
);
};

export default ServiceManagementPage;