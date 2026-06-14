import React, { useEffect, useState } from 'react';
import adminPromotionService from '../../services/adminPromotionService';
import PromotionModal from '../../components/admin/PromotionModal';
import AdminSwitch from '../../components/admin/AdminSwitch';

const PromotionManagementPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const fetchPromotions = async () => {
    const res = await adminPromotionService.getPromotions();
    setPromotions(res.data?.data || res.data || []);
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleCreate = () => {
    setSelectedPromotion(null);
    setOpenModal(true);
  };

  const handleEdit = (promotion) => {
    setSelectedPromotion(promotion);
    setOpenModal(true);
  };

  const handleSubmit = async (form) => {
    const payload = {
      ...form,
      value: Number(form.value),
      maxUsage: Number(form.maxUsage),
    };

    if (selectedPromotion) {
      await adminPromotionService.updatePromotion(selectedPromotion.id, payload);
    } else {
      await adminPromotionService.createPromotion(payload);
    }

    setOpenModal(false);
    fetchPromotions();
  };

  const handleToggle = async (promotion) => {
    await adminPromotionService.togglePromotion(promotion.id);
    fetchPromotions();
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Promotion Management</h2>
        <button onClick={handleCreate}>Add Promotion</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Promo Code</th>
            <th>Min Tier</th>
            <th>Discount Type</th>
            <th>Value</th>
            <th>Max Usage</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {promotions.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.promoCode}</td>
              <td>{item.minTier}</td>
              <td>{item.discountType}</td>
              <td>{item.value}</td>
              <td>{item.maxUsage}</td>
              <td>
                <AdminSwitch
                  checked={item.isActive}
                  onChange={() => handleToggle(item)}
                />
              </td>
              <td>
                <button onClick={() => handleEdit(item)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PromotionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        initialData={selectedPromotion}
      />
    </div>
  );
};

export default PromotionManagementPage;