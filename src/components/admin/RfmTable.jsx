import { useMemo, useState, useEffect } from "react";
import Papa from "papaparse";
import { toast } from "react-hot-toast";

const PAGE_SIZE = 20;

const HEADER_LABELS = {
  customer: "Khách hàng",
  recency: "Recency (Ngày)",
  frequency: "Frequency (Lần)",
  monetary: "Monetary (VNĐ)",
  points: "Points",
  tier: "Tier",
  segment: "Phân khúc",
  action: "Hành động gợi ý"
};

const getRfmSegment = (recency, frequency, monetary) => {
  const r = Number(recency);
  const f = Number(frequency);
  const m = Number(monetary);

  if (r <= 5 && f >= 15 && m >= 3000000) {
    return { name: "Champions", className: "champions" };
  }
  if (r <= 15 && f >= 8 && m >= 1500000) {
    return { name: "Loyal Customers", className: "loyal" };
  }
  if (r <= 10 && f >= 4 && m >= 500000) {
    return { name: "Potential Loyalists", className: "potential" };
  }
  if (r <= 7 && f <= 2) {
    return { name: "New Customers", className: "new" };
  }
  if (r > 15 && f >= 8) {
    return { name: "At Risk", className: "at-risk" };
  }
  if (r > 30 && f <= 5) {
    return { name: "About to Sleep", className: "about-to-sleep" };
  }
  return { name: "Lost Customers", className: "lost" };
};

export default function RfmTable({ data, initialSegment = "" }) {
  const [sortKey, setSortKey] = useState("monetary");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [segmentFilter, setSegmentFilter] = useState(initialSegment);

  useEffect(() => {
    setSegmentFilter(initialSegment);
    setPage(1);
  }, [initialSegment]);

  const dataWithSegments = useMemo(() => {
    return data.map((row) => {
      const seg = getRfmSegment(row.recency, row.frequency, row.monetary);
      return {
        ...row,
        segmentName: seg.name,
        segmentClass: seg.className,
      };
    });
  }, [data]);

  const filteredData = useMemo(() => {
    let result = dataWithSegments;
    if (segmentFilter) {
      result = result.filter(row => row.segmentName === segmentFilter);
    }
    return result;
  }, [dataWithSegments, segmentFilter]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = sortKey === "segment" ? a.segmentName : a[sortKey];
      const bVal = sortKey === "segment" ? b.segmentName : b[sortKey];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / PAGE_SIZE));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedData.slice(start, start + PAGE_SIZE);
  }, [sortedData, page]);

  const exportCSV = () => {
    const exportData = dataWithSegments.map((row) => ({
      customer: row.customer,
      recency: Number(row.recency),
      frequency: Number(row.frequency),
      monetary: Number(row.monetary),
      points: Number(row.points),
      tier: row.tier,
      segment: row.segmentName,
    }));

    const csv = "\uFEFF" + Papa.unparse(exportData);

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "rfm-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleSort = (key) => {
    setPage(1);

    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDir("desc");
  };

  const getTierBadge = (tier) => {
    const t = String(tier || "").toUpperCase();
    switch (t) {
      case "GOLD":
        return <span className="rfm-tier-badge gold">Gold</span>;
      case "SILVER":
        return <span className="rfm-tier-badge silver">Silver</span>;
      case "PLATINUM":
        return <span className="rfm-tier-badge platinum">Platinum</span>;
      default:
        return <span className="rfm-tier-badge member">Member</span>;
    }
  };

  const handleAction = (customerName, segmentName) => {
    if (segmentName === "Champions") {
      toast.success(`Đã gửi tặng Voucher VIP giảm 20% cho khách hàng ${customerName}! 💎`);
    } else if (segmentName === "At Risk") {
      toast.success(`Đã gửi tặng mã giảm giá tri ân 15% cho khách hàng ${customerName}! ✉️`);
    } else if (segmentName === "New Customers") {
      toast.success(`Đã gửi tặng ưu đãi giảm 10% lần rửa thứ 2 cho khách hàng ${customerName}! 🎁`);
    } else if (segmentName === "Lost Customers") {
      toast.success(`Đã kích hoạt chiến dịch win-back và gửi quà tặng đặc biệt cho khách hàng ${customerName}! ⚡`);
    }
  };

  const startIdx = sortedData.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, sortedData.length);

  return (
    <div className="rfm-data-card" id="rfm-table-section">
      <div className="rfm-card-header" style={{ height: "auto", flexWrap: "wrap", gap: "12px", padding: "16px 24px" }}>
        <h3 className="rfm-card-title">Phân tích RFM khách hàng</h3>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Segment dropdown filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Lọc theo phân khúc:</span>
            <select
              value={segmentFilter}
              onChange={(e) => {
                setSegmentFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs px-3 py-1.5 border border-[#BCC8CE] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00677F] bg-white text-slate-700 cursor-pointer"
            >
              <option value="">Tất cả phân khúc</option>
              <option value="Champions">Champions</option>
              <option value="Loyal Customers">Loyal Customers</option>
              <option value="Potential Loyalists">Potential Loyalists</option>
              <option value="New Customers">New Customers</option>
              <option value="At Risk">At Risk</option>
              <option value="About to Sleep">About to Sleep</option>
              <option value="Lost Customers">Lost Customers</option>
            </select>
          </div>

          <button
            onClick={exportCSV}
            className="rfm-export-btn cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Xuất dữ liệu CSV
          </button>
        </div>
      </div>

      <div className="rfm-table-wrapper">
        <table className="rfm-table">
          <thead>
            <tr className="rfm-thead-row">
              {["customer", "recency", "frequency", "monetary", "points", "tier", "segment", "action"].map(
                (item) => (
                  <th
                    key={item}
                    onClick={() => item !== 'action' && handleSort(item)}
                    className={`rfm-th ${item}`}
                    style={item !== 'action' ? { cursor: "pointer", userSelect: "none" } : {}}
                  >
                    <span>{HEADER_LABELS[item]}</span>
                    {sortKey === item && item !== 'action' && (
                      <span className="rfm-th-arrow">
                        {sortDir === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.customerId ?? row.customer} className="rfm-tbody-row">
                <td className="rfm-td customer">{row.customer}</td>
                <td className="rfm-td recency">{row.recency != null ? `${row.recency} ngày` : "—"}</td>
                <td className="rfm-td frequency">{row.frequency} lần</td>
                <td className="rfm-td monetary">{row.monetary?.toLocaleString()}đ</td>
                <td className="rfm-td points">{row.points != null ? row.points.toLocaleString() : "—"}</td>
                <td className="rfm-td tier">
                  {getTierBadge(row.tier)}
                </td>
                <td className="rfm-td segment">
                  <span className={`rfm-segment-badge ${row.segmentClass}`}>
                    {row.segmentName}
                  </span>
                </td>
                <td className="rfm-td action">
                  {row.segmentName === "Champions" && (
                    <button className="rfm-action-btn vip" onClick={() => handleAction(row.customer, "Champions")}>
                      💎 Tặng voucher VIP
                    </button>
                  )}
                  {row.segmentName === "At Risk" && (
                    <button className="rfm-action-btn discount" onClick={() => handleAction(row.customer, "At Risk")}>
                      ✉️ Gửi mã giảm giá
                    </button>
                  )}
                  {row.segmentName === "New Customers" && (
                    <button className="rfm-action-btn promo2" onClick={() => handleAction(row.customer, "New Customers")}>
                      🎁 Khuyến mãi lần 2
                    </button>
                  )}
                  {row.segmentName === "Lost Customers" && (
                    <button className="rfm-action-btn winback" onClick={() => handleAction(row.customer, "Lost Customers")}>
                      ⚡ Chiến dịch win-back
                    </button>
                  )}
                  {!["Champions", "At Risk", "New Customers", "Lost Customers"].includes(row.segmentName) && (
                    <span className="text-xs text-slate-400 italic">Chăm sóc định kỳ</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rfm-pagination">
        <div className="rfm-pagination-info">
          Hiển thị {startIdx} đến {endIdx} trong số {sortedData.length} khách hàng
        </div>

        <div className="rfm-pagination-actions">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="rfm-pagination-btn cursor-pointer"
          >
            Trước
          </button>

          <span className="rfm-pagination-pagespan">
            Trang {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="rfm-pagination-btn cursor-pointer"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}