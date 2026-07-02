import React, { useEffect, useState } from 'react';
import adminServiceService from '../../services/adminServiceService';
import ServiceModal from '../../components/admin/ServiceModal';
import AdminSwitch from '../../components/admin/AdminSwitch';

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
      status: form.status || 'Active',
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

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Quản lý dịch vụ</h2>
          <p className="text-slate-400 text-sm mt-1">
            Thiết lập danh mục dịch vụ rửa xe, đơn giá và thời gian hoàn thành dự kiến
          </p>
        </div>
      </div>

      {/* Services List Table */}
      <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white text-lg font-bold">
            Danh mục dịch vụ
          </h3>

          <button
            onClick={handleCreate}
            className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition duration-200 shadow-md shadow-cyan-500/10 cursor-pointer flex items-center gap-1.5"
          >
            <span>+</span> Thêm dịch vụ
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-slate-450 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 text-left">Tên dịch vụ</th>
                <th className="px-6 py-4 text-left">Phân loại</th>
                <th className="px-6 py-4 text-left">Đơn giá</th>
                <th className="px-6 py-4 text-left">Thời gian</th>
                <th className="px-6 py-4 text-left">Mô tả</th>
                <th className="px-6 py-4 text-left">Trạng thái</th>
                <th className="px-6 py-4 text-right">Tác vụ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {services.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-white/[0.01] transition-all duration-150"
                >
                  <td className="px-6 py-4 text-slate-200 font-semibold text-sm">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-slate-350">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white/[0.04] border border-white/5">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-200 font-semibold">
                    {Number(item.price).toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-mono text-sm">
                    {item.duration} phút
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs max-w-xs truncate">
                    {item.description || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <AdminSwitch
                      checked={item.status === 'Active'}
                      onChange={async (checked) => {
                        try {
                          const updatedPayload = {
                            serviceName: item.name,
                            serviceCategory: item.category,
                            price: Number(item.price),
                            duration: Number(item.duration),
                            description: item.description,
                            status: checked ? 'Active' : 'Inactive'
                          };
                          await adminServiceService.updateService(item.id, updatedPayload);
                          await fetchServices();
                        } catch (err) {
                          console.error("Error toggling service status:", err);
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-[#070913] hover:bg-white/[0.04] border border-white/10 text-cyan-400 font-bold px-3.5 py-1.5 rounded-lg text-xs transition cursor-pointer"
                    >
                      Sửa
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