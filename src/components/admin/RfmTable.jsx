import { useMemo, useState } from "react";

const PAGE_SIZE = 10;

const TIER_STYLES = {
  GOLD: "bg-amber-100 text-amber-600 border border-amber-200",
  SILVER: "bg-slate-200 text-slate-600 border border-slate-300",
  PLATINUM: "bg-fuchsia-100 text-fuchsia-600 border border-fuchsia-200",
  MEMBER: "bg-cyan-100 text-cyan-600 border border-cyan-200",
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

  const handleSort = (key) => {
    setPage(1);

    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDir("desc");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/30">
        <h3 className="text-lg font-bold text-slate-800">RFM Analysis</h3>
        <button className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined text-xl">more_horiz</span></button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/80 border-b border-slate-200">
            <tr className="divide-x divide-slate-200">
              {[
                { key: "customer", label: "CUSTOMER" },
                { key: "recency", label: "RECENCY (DAYS)" },
                { key: "frequency", label: "FREQUENCY" },
                { key: "monetary", label: "MONETARY" },
                { key: "points", label: "POINTS" },
                { key: "tier", label: "TIER" }
              ].map(
                (col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      {col.label}
                      <span className="text-slate-400">
                        {sortKey === col.key ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
                      </span>
                    </div>
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {paginatedData.length === 0 ? (
                <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">Không có dữ liệu RFM</td>
                </tr>
            ) : (
                paginatedData.map((row) => {
                    const tierStr = row.tier ? row.tier.toUpperCase() : 'MEMBER';
                    const tierStyle = TIER_STYLES[tierStr] || TIER_STYLES.MEMBER;
                    
                    const initials = row.customer ? row.customer.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'KV';
                    const avatarColors = ["bg-sky-100 text-sky-700", "bg-emerald-100 text-emerald-700", "bg-indigo-100 text-indigo-700", "bg-rose-100 text-rose-700"];
                    const avatarColor = avatarColors[(row.customer || '').length % avatarColors.length];

                    return (
                        <tr key={row.customer} className="hover:bg-slate-50 transition-colors divide-x divide-slate-100">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold ${avatarColor}`}>
                                        {initials}
                                    </div>
                                    <span className="font-semibold text-slate-800">{row.customer}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-medium">{row.recency}</td>
                            <td className="px-6 py-4 text-slate-600 font-medium">{row.frequency}</td>
                            <td className="px-6 py-4 font-bold text-slate-900">{row.monetary.toLocaleString()} đ</td>
                            <td className="px-6 py-4 font-medium text-slate-600">{row.points ? row.points.toLocaleString() : '0'} pts</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${tierStyle}`}>
                                    {tierStr}
                                </span>
                            </td>
                        </tr>
                    );
                })
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-200 p-4 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
        <div>
          Hiển thị <span className="font-medium text-slate-700">{(page - 1) * PAGE_SIZE + (paginatedData.length > 0 ? 1 : 0)}</span> đến <span className="font-medium text-slate-700">{Math.min(page * PAGE_SIZE, sortedData.length)}</span> trong <span className="font-medium text-slate-700">{sortedData.length}</span> kết quả
        </div>
        
        <div className="flex items-center gap-4">
          <span>Trang {page} / {totalPages}</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <span className="material-symbols-outlined text-sm mr-1">chevron_left</span> Trước
            </button>
            <button 
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Sau <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}