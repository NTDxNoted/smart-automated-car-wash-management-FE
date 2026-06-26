import { useMemo, useState } from "react";
import Papa from "papaparse";

const PAGE_SIZE = 20;

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

  return (
    <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5">
      <div className="flex justify-between mb-4">
        <h3 className="text-white font-semibold">RFM Analysis</h3>

        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {["customer", "recency", "frequency", "monetary", "points", "tier"].map(
                (item) => (
                  <th
                    key={item}
                    onClick={() => handleSort(item)}
                    className="text-left p-3 cursor-pointer text-white"
                  >
                    {item.toUpperCase()}
                    {sortKey === item ? ` ${sortDir === "asc" ? "▲" : "▼"}` : ""}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.customer} className="border-t border-white/5">
                <td className="p-3">{row.customer}</td>
                <td className="p-3">{row.recency}</td>
                <td className="p-3">{row.frequency}</td>
                <td className="p-3">{row.monetary.toLocaleString()}</td>
                <td className="p-3">{row.points}</td>
                <td className="p-3">{row.tier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-3 mt-4 text-white">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="px-3 py-1 rounded bg-white/10 disabled:opacity-40"
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          className="px-3 py-1 rounded bg-white/10 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}