import { useMemo, useState } from "react";
import Papa from "papaparse";

export default function RfmTable({ data }) {
  const [sortKey, setSortKey] = useState("monetary");
  const [sortDir, setSortDir] = useState("desc");

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      return sortDir === "asc"
        ? a[sortKey] > b[sortKey]
          ? 1
          : -1
        : a[sortKey] < b[sortKey]
        ? 1
        : -1;
    });
  }, [data, sortKey, sortDir]);

  const exportCSV = () => {
    const csv = Papa.unparse(data);

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "rfm-report.csv";
    link.click();
  };

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDir((prev) =>
        prev === "asc" ? "desc" : "asc"
      );
      return;
    }

    setSortKey(key);
    setSortDir("desc");
  };

  return (
    <div className="bg-[#0c0f24] p-6 rounded-2xl border border-white/5">
      <div className="flex justify-between mb-4">
        <h3 className="text-white font-semibold">
          RFM Analysis
        </h3>

        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg"
        >
          Export CSV
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr>
            {[
              "customer",
              "recency",
              "frequency",
              "monetary",
              "points",
              "tier",
            ].map((item) => (
              <th
                key={item}
                onClick={() => handleSort(item)}
                className="text-left p-3 cursor-pointer text-white"
              >
                {item.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedData.map((row) => (
            <tr
              key={row.customer}
              className="border-t border-white/5"
            >
              <td className="p-3">{row.customer}</td>
              <td className="p-3">{row.recency}</td>
              <td className="p-3">{row.frequency}</td>
              <td className="p-3">
                {row.monetary.toLocaleString()}
              </td>
              <td className="p-3">{row.points}</td>
              <td className="p-3">{row.tier}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}