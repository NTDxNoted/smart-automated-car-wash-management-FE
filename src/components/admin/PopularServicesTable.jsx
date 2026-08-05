import { useMemo, useState } from "react";
import Papa from "papaparse";

const HEADER_LABELS = {
  ranking: "Thứ hạng",
  serviceName: "Tên dịch vụ",
  totalWashes: "Tổng lượt rửa",
  revenue: "Doanh thu (VNĐ)",
  revenueContribution: "Đóng góp (%)",
};

export default function PopularServicesTable({ data }) {
  const [sortKey, setSortKey] = useState("totalWashes");
  const [sortDir, setSortDir] = useState("desc");

  // Normalize data for sorting
  const normalizedData = useMemo(() => {
    return data.map((item, idx) => ({
      ranking: item.ranking || (idx + 1),
      serviceName: item.serviceName || item.service_name || "N/A",
      totalWashes: Number(item.totalWashes ?? item.total_washes ?? 0),
      revenue: Number(item.revenue ?? 0),
      revenueContribution: Number(item.revenueContribution ?? item.revenue_contribution ?? 0),
    }));
  }, [data]);

  const sortedData = useMemo(() => {
    return [...normalizedData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [normalizedData, sortKey, sortDir]);

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("desc");
  };

  const exportCSV = () => {
    const exportData = sortedData.map((row) => ({
      "Thứ hạng": row.ranking,
      "Tên dịch vụ": row.serviceName,
      "Tổng lượt rửa": row.totalWashes,
      "Doanh thu (VNĐ)": row.revenue,
      "Đóng góp (%)": `${Math.round(row.revenueContribution)}%`,
    }));

    const csv = "\uFEFF" + Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "popular-services-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!sortedData || sortedData.length === 0) {
    return (
      <div className="rfm-data-card p-8 text-center text-slate-500 font-medium">
        Không có dữ liệu chi tiết cho bảng dịch vụ.
      </div>
    );
  }

  const COLUMN_FLEX_STYLES = {
    ranking: { flex: "0 0 12%" },
    serviceName: { flex: "1 1 35%" },
    totalWashes: { flex: "0 0 15%" },
    revenue: { flex: "0 0 20%" },
    revenueContribution: { flex: "0 0 18%" },
  };

  return (
    <div className="rfm-data-card">
      <div className="rfm-card-header">
        <h3 className="rfm-card-title">Bảng phân tích doanh thu dịch vụ</h3>
        <button onClick={exportCSV} className="rfm-export-btn">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Xuất dữ liệu CSV
        </button>
      </div>

      <div className="rfm-table-wrapper">
        <table className="rfm-table">
          <thead>
            <tr className="rfm-thead-row">
              {["ranking", "serviceName", "totalWashes", "revenue", "revenueContribution"].map(
                (item) => (
                  <th
                    key={item}
                    onClick={() => handleSort(item)}
                    className={`rfm-th ${item}`}
                    style={{ cursor: "pointer", userSelect: "none", ...COLUMN_FLEX_STYLES[item] }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      {HEADER_LABELS[item]}
                      {sortKey === item && (
                        <span className="rfm-th-arrow">
                          {sortDir === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </span>
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {sortedData.map((row) => (
              <tr key={row.serviceName} className="rfm-tbody-row">
                <td className="rfm-td ranking" style={COLUMN_FLEX_STYLES.ranking}>{row.ranking}</td>
                <td className="rfm-td serviceName" style={{ fontWeight: 500, color: "#1E293B", ...COLUMN_FLEX_STYLES.serviceName }}>
                  {row.serviceName}
                </td>
                <td className="rfm-td totalWashes" style={COLUMN_FLEX_STYLES.totalWashes}>{row.totalWashes} lần</td>
                <td className="rfm-td revenue" style={{ fontWeight: 600, color: "#111C2C", ...COLUMN_FLEX_STYLES.revenue }}>
                  {row.revenue?.toLocaleString()} VND
                </td>
                <td className="rfm-td revenueContribution" style={COLUMN_FLEX_STYLES.revenueContribution}>
                  {Math.round(row.revenueContribution)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
