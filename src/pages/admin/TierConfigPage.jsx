import React, { useEffect, useState } from 'react';
import adminTierService from '../../services/adminTierService';
import TierModal from '../../components/admin/TierModal';

const CAN_MUTATE_TIER_STRUCTURE = false;


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
    await fetchTiers();
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

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Tier Configuration</h2>
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
        <h3
          style={{
            color: "#fff",
            marginBottom: "20px",
            fontSize: "20px",
          }}
        >
          Cấu hình hạng thành viên
        </h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Tier Name</th>
              <th style={thStyle}>Min Spending</th>
              <th style={thStyle}>Discount Rate</th>
              <th style={thStyle}>Booking Window Days</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {tiers.map((tier) => (
              <tr key={tier.id}>
                <td style={tdStyle}>{tier.name}</td>
                <td style={tdStyle}>
                  {tier.minSpending?.toLocaleString()}
                </td>
                <td style={tdStyle}>
                  {tier.discountRate}%
                </td>
                <td style={tdStyle}>
                  {tier.bookingWindowDays} ngày
                </td>

                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(tier)}
                    style={{
                      background: "#0ea5e9",
                      border: "none",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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