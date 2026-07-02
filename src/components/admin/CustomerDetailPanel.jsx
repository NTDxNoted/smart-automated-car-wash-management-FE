export default function CustomerDetailPanel({ customer }) {
  const getTierBadge = (tier) => {
    switch (tier?.toUpperCase()) {
      case "PLATINUM":
        return "cust-tier-badge platinum";
      case "GOLD":
        return "cust-tier-badge gold";
      case "SILVER":
        return "cust-tier-badge silver";
      default:
        return "cust-tier-badge member";
    }
  };

  return (
    <div className="detail-grid">
      <Info title="Họ tên" value={customer.fullName} />
      <Info title="Số điện thoại" value={customer.phone} />
      
      <div className="detail-item-box">
        <p className="detail-item-label">Hạng thành viên (Tier)</p>
        <div className="badge-container">
          <span className={getTierBadge(customer.tier)}>
            {customer.tier || 'Member'}
          </span>
        </div>
      </div>

      <Info title="Điểm tích lũy" value={`${(customer.points ?? 0).toLocaleString()} pts`} />
      <Info
        title="Tổng chi tiêu"
        value={`${Number(customer.totalSpending || 0).toLocaleString()}đ`}
      />
      <Info
        title="Ngày tạo tài khoản"
        value={customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('vi-VN') : '-'}
      />

      <div className="detail-item-box">
        <p className="detail-item-label">Trạng thái tài khoản</p>
        <div className="badge-container">
          {(() => {
            const isLocked = customer.isLocked || customer.status === 'LOCKED';
            const isSuspended = customer.status === 'SUSPENDED';
            if (isLocked) {
              return (
                <span className="cust-status-badge locked">
                  Bị khóa
                </span>
              );
            }
            if (isSuspended) {
              return (
                <span className="cust-status-badge suspended">
                  Tạm đình chỉ
                </span>
              );
            }
            return (
              <span className="cust-status-badge active">
                Hoạt động
              </span>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div className="detail-item-box">
      <p className="detail-item-label">{title}</p>
      <p className="detail-item-value">{value ?? '-'}</p>
    </div>
  );
}