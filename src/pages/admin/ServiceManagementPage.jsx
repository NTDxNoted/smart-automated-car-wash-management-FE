import React, { useEffect, useState } from 'react';
import adminServiceService from '../../services/adminServiceService';
import ServiceModal from '../../components/admin/ServiceModal';
import './ServiceManagementPage.css';

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

  const handleToggleStatus = async (item) => {
    try {
      await adminServiceService.toggleStatus(item.id);
      const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active';
      setServices(prev => prev.map(s => s.id === item.id ? { ...s, status: nextStatus } : s));
    } catch (err) {
      console.error("Error toggling service status:", err);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn ngưng hoạt động dịch vụ "${item.name}" không?`);
    if (!confirmed) return;
    try {
      if (item.status === 'Active') {
        await adminServiceService.toggleStatus(item.id);
        setServices(prev => prev.map(s => s.id === item.id ? { ...s, status: 'Inactive' } : s));
      }
    } catch (err) {
      console.error("Error deactivating service:", err);
    }
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

      const newStatus = form.status || 'Active';
      if (selectedService.status !== newStatus) {
        await adminServiceService.toggleStatus(selectedService.id);
      }
    } else {
      await adminServiceService.createService(payload);
    }

    setOpenModal(false);
    await fetchServices();
  };

  return (
    <div className="service-page-container">
      {/* Service Subtitle */}
      <div className="service-page-subtitle"></div>

      {/* Service Data Card */}
      <div className="service-data-card">
        {/* Card Header */}
        <div className="service-card-header">
          <div className="service-card-title">Quản lý dịch vụ</div>

          <button
            onClick={handleCreate}
            className="service-add-btn"
          >
            <span>+</span> Thêm dịch vụ
          </button>
        </div>

        {/* Card Body / Table wrapper */}
        <div className="service-table-wrapper">
          <table className="service-table">
            <thead>
              <tr className="service-thead-row">
                <th className="service-th name">Tên dịch vụ</th>
                <th className="service-th category">Phân loại</th>
                <th className="service-th price">Đơn giá</th>
                <th className="service-th duration">Thời gian</th>
                <th className="service-th description">Mô tả</th>
                <th className="service-th status">Trạng thái</th>
                <th className="service-th action">Tác vụ</th>
              </tr>
            </thead>

            <tbody>
              {services.map((item) => (
                <tr
                  key={item.id}
                  className="service-tbody-row"
                >
                  <td className="service-td name">
                    <span className="service-name-text">{item.name}</span>
                  </td>

                  <td className="service-td category">
                    <span className="service-category-text">{item.category}</span>
                  </td>

                  <td className="service-td price">
                    <span className="service-price-text">
                      {Number(item.price).toLocaleString()} đ
                    </span>
                  </td>

                  <td className="service-td duration">
                    <span className="service-duration-text">{item.duration} Phút</span>
                  </td>

                  <td className="service-td description">
                    <span className="service-description-text truncate" title={item.description}>
                      {item.description || '-'}
                    </span>
                  </td>

                  <td className="service-td status">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item)}
                      className={`service-status-capsule ${item.status === 'Active' ? 'active' : 'inactive'}`}
                      title="Click để đổi trạng thái"
                    >
                      {item.status === 'Active' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                    </button>
                  </td>

                  <td className="service-td action">
                    <button
                      onClick={() => handleEdit(item)}
                      className="service-action-btn edit"
                      title="Sửa"
                    >
                      <svg className="w-[13.98px] h-[13.98px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDelete(item)}
                      className="service-action-btn delete"
                      title="Ngưng hoạt động"
                    >
                      <svg className="w-[12.25px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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