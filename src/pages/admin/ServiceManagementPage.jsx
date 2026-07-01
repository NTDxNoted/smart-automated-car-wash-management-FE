import React, { useEffect, useState } from 'react';
import adminServiceService from '../../services/adminServiceService';
import ServiceModal from '../../components/admin/ServiceModal';

const ServiceManagementPage = () => {
  const [services, setServices] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await adminServiceService.getAdminServices();
      setServices(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      ...form,
      price: Number(form.price),
      duration: Number(form.duration),
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
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Quản lý dịch vụ
            </h2>
            <p className="text-sm text-slate-500 mt-1">Configure and manage available wash services</p>
          </div>
          <button 
            onClick={handleCreate} 
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Service
          </button>
        </div>

        <div className="flex-1 rounded-xl border border-slate-200 overflow-hidden mb-2">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50 border-b border-slate-200">
                <tr className="divide-x divide-slate-200">
                  <th className="px-6 py-5">SERVICE NAME</th>
                  <th className="px-6 py-5">CATEGORY</th>
                  <th className="px-6 py-5">BASE PRICE</th>
                  <th className="px-6 py-5">DURATION</th>
                  <th className="px-6 py-5">DESCRIPTION</th>
                  <th className="px-6 py-5 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-slate-500">Đang tải dữ liệu...</td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-slate-500">Không có dịch vụ nào</td>
                  </tr>
                ) : (
                  services.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors divide-x divide-slate-100">
                      <td className="px-6 py-4 font-semibold text-slate-800">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {item.category || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-cyan-600">{Number(item.price).toLocaleString()} đ</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{item.duration} phút</td>
                      <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={item.description}>{item.description}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEdit(item)} 
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button 
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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