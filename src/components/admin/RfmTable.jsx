import { useMemo, useState } from "react";
import Papa from "papaparse";

const PAGE_SIZE = 20;

const HEADER_LABELS = {
  customer: "Khách hàng",
  recency: "Recency (Ngày)",
  frequency: "Frequency (Lần)",
  monetary: "Monetary (VNĐ)",
  points: "Points",
  tier: "Tier",
};

export default function RfmTable({ data }) {
  const [sortKey, setSortKey] = useState("monetary");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / PAGE_SIZE));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedData.slice(start, start + PAGE_SIZE);
  }, [sortedData, page]);

  const exportCSV = () => {
    const exportData = data.map((row) => ({
      customer: row.customer,
      recency: Number(row.recency),
      frequency: Number(row.frequency),
      monetary: Number(row.monetary),
      points: Number(row.points),
      tier: row.tier,
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

  const startIdx = data.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, sortedData.length);

  return (
    <div className="rfm-data-card">
      <div className="rfm-card-header">
        <h3 className="rfm-card-title">Phân tích RFM khách hàng</h3>

        <button
          onClick={exportCSV}
          className="rfm-export-btn"
        >
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
              {["customer", "recency", "frequency", "monetary", "points", "tier"].map(
                (item) => (
                  <th
                    key={item}
                    onClick={() => handleSort(item)}
                    className={`rfm-th ${item}`}
                  >
                    <span>{HEADER_LABELS[item]}</span>
                    {sortKey === item && (
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
              <tr key={row.customer} className="rfm-tbody-row">
                <td className="rfm-td customer">{row.customer}</td>
                <td className="rfm-td recency">{row.recency} ngày</td>
                <td className="rfm-td frequency">{row.frequency} lần</td>
                <td className="rfm-td monetary">{row.monetary?.toLocaleString()}đ</td>
                <td className="rfm-td points">{row.points?.toLocaleString()}</td>
                <td className="rfm-td tier">
                  {getTierBadge(row.tier)}
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
            className="rfm-pagination-btn"
          >
            Trước
          </button>

          <span className="rfm-pagination-pagespan">
            Trang {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="rfm-pagination-btn"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}