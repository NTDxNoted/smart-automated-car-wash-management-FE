import React, { useEffect, useState } from 'react';
import adminServiceService from '../../services/adminServiceService';
import ServiceModal from '../../components/admin/ServiceModal';

const ServiceManagementPage = () => {
  const [services, setServices] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const fetchServices = async () => {
    const res = await adminServiceService.getAdminServices();
    setServices(res.data?.data || res.data || []);
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
      ...form,
      price: Number(form.price),
      duration: Number(form.duration),
    };

    if (selectedService) {
      alert('Giá mới chỉ áp dụng cho booking mới');
      await adminServiceService.updateService(selectedService.id, payload);
    } else {
      await adminServiceService.createService(payload);
    }

    setOpenModal(false);
    fetchServices();
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Service Management</h2>
        <button onClick={handleCreate}>Add Service</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Duration</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {services.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.price}</td>
              <td>{item.duration}</td>
              <td>{item.description}</td>
              <td>
                <button onClick={() => handleEdit(item)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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