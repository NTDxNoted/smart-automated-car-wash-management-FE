import { useMemo, useState } from "react";
import Papa from "papaparse";

const HEADER_LABELS = {
  promoCode: "Mã khuyến mãi",
  totalUsage: "Lượt sử dụng",
  totalDiscount: "Tổng tiền giảm (VNĐ)",
  revenueGenerated: "Doanh thu mang lại (VNĐ)",
};

export default function PromoRoiTable({ data }) {
  const [sortKey, setSortKey] = useState("revenueGenerated");
  const [sortDir, setSortDir] = useState("desc");
  const [keyword, setKeyword] = useState("");

  // Normalize data
  const normalizedData = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      promoCode: item.promoCode || item.promo_code || "UNKNOWN",
      totalUsage: Number(item.totalUsage ?? item.total_usage ?? 0),
      totalDiscount: Number(item.totalDiscount ?? item.total_discount ?? 0),
      revenueGenerated: Number(item.revenueGenerated ?? item.revenue_generated ?? 0),
    }));
  }, [data]);

  // Filtered by keyword
  const filteredData = useMemo(() => {
    if (!keyword.trim()) return normalizedData;
    const lower = keyword.toLowerCase();
    return normalizedData.filter(item =>
      item.promoCode.toLowerCase().includes(lower)
    );
  }, [normalizedData, keyword]);

  // Sorted
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortKey, sortDir]);

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
      "Mã khuyến mãi": row.promoCode,
      "Lượt sử dụng": row.totalUsage,
      "Tổng tiền giảm (VNĐ)": row.totalDiscount,
      "Doanh thu mang lại (VNĐ)": row.revenueGenerated,
    }));

    const csv = "\uFEFF" + Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "promotions-roi-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rfm-data-card" style={{ width: "100%" }}>
      <div className="rfm-card-header flex-col md:flex-row gap-4" style={{ height: "auto", padding: "16px 24px" }}>
        <h3 className="rfm-card-title">Hiệu quả từng chiến dịch khuyến mãi</h3>

        <div className="flex items-center gap-3 w-full md:w-auto self-stretch justify-end">
          {/* Quick Search */}
          <div className="booking-search-wrapper" style={{ flex: "1 1 auto", maxWidth: "250px", height: "36px" }}>
            <input
              placeholder="Tìm kiếm mã..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="booking-search-input"
              style={{ height: "36px", padding: "8px 12px 8px 36px", fontSize: "13px" }}
            />
            <svg className="booking-search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ left: "12px", width: "14px", height: "14px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Export CSV Button */}
          <button onClick={exportCSV} className="rfm-export-btn" style={{ height: "36px", fontSize: "13px", padding: "0 14px", shrink: 0 }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Xuất CSV
          </button>
        </div>
      </div>

      <div className="rfm-table-wrapper">
        <table className="rfm-table">
          <thead>
            <tr className="rfm-thead-row">
              {["promoCode", "totalUsage", "totalDiscount", "revenueGenerated"].map(
                (item) => (
                  <th
                    key={item}
                    onClick={() => handleSort(item)}
                    className={`rfm-th ${item}`}
                    style={{ cursor: "pointer", userSelect: "none", flex: item === "promoCode" ? "1 1 25%" : "0 0 25%" }}
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
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-8 text-slate-500 font-medium w-full">
                  Không tìm thấy mã khuyến mãi nào phù hợp.
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr key={row.promoCode} className="rfm-tbody-row">
                  <td className="rfm-td promoCode" style={{ flex: "1 1 25%", fontWeight: 600, color: "#00677F" }}>
                    {row.promoCode}
                  </td>
                  <td className="rfm-td totalUsage" style={{ flex: "0 0 25%" }}>
                    {row.totalUsage?.toLocaleString()} lần
                  </td>
                  <td className="rfm-td totalDiscount" style={{ flex: "0 0 25%", color: "#EF4444" }}>
                    {row.totalDiscount?.toLocaleString()}đ
                  </td>
                  <td className="rfm-td revenueGenerated" style={{ flex: "0 0 25%", fontWeight: 600, color: "#10B981" }}>
                    {row.revenueGenerated?.toLocaleString()}đ
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
