import React, { useEffect, useState } from 'react';
import adminTierService from '../../services/adminTierService';
import TierModal from '../../components/admin/TierModal';

const TierConfigPage = () => {
  const [tiers, setTiers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  const fetchTiers = async () => {
    const res = await adminTierService.getTiers();
    setTiers(res.data?.data || res.data || []);
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  const handleEdit = (tier) => {
    setSelectedTier(tier);
    setOpenModal(true);
  };

  const handleSubmit = async (form) => {
    const payload = {
      ...form,
      minSpending: Number(form.minSpending),
      discountRate: Number(form.discountRate),
      bookingWindowDays: Number(form.bookingWindowDays),
    };

    await adminTierService.updateTier(selectedTier.id, payload);

    setOpenModal(false);
    fetchTiers();
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Tier Configuration</h2>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Tier Name</th>
            <th>Min Spending</th>
            <th>Discount Rate</th>
            <th>Booking Window Days</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tiers.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.minSpending}</td>
              <td>{item.discountRate}</td>
              <td>{item.bookingWindowDays}</td>
              <td>
                <button onClick={() => handleEdit(item)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <TierModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        initialData={selectedTier}
      />
    </div>
  );
};

export default TierConfigPage;