import React from 'react';

const AdminSwitch = ({ checked, onChange }) => {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="slider" />
    </label>
  );
};

export default AdminSwitch;