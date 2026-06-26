import React from 'react';

const AdminSwitch = ({
  checked,
  onChange,
  disabled = false,
  loading = false,
}) => {
  return (
    <label
      className="switch"
      style={{
        opacity: disabled || loading ? 0.6 : 1,
        pointerEvents: disabled || loading ? 'none' : 'auto',
      }}
    >
      <input
        type="checkbox"
        checked={Boolean(checked)}
        disabled={disabled || loading}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="slider" />
      {loading && (
        <span style={{ marginLeft: 8, color: '#94a3b8', fontSize: 12 }}>
          Saving...
        </span>
      )}
    </label>
  );
};

export default AdminSwitch;