"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  title?: string;
}

export default function DataTable({ columns, data, title }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredData = (data ?? []).filter((item) =>
  Object.values(item).some((value) =>
    String(value).toLowerCase().includes(searchTerm.toLowerCase())
  )
);


  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white/90 dark:bg-black/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        {title && (
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-500 via-blue-500 to-red-500 bg-clip-text text-transparent">
            {title}
          </h2>
        )}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 pl-10 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-900/70 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500"
            size={18}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white text-xs uppercase tracking-wider">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-6 py-3 cursor-pointer select-none hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key &&
                      (sortOrder === "asc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <motion.tbody
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.05 },
              },
            }}
          >
            {sortedData.length > 0 ? (
              sortedData.map((row, i) => (
                <motion.tr
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-purple-50/70 dark:hover:bg-gray-800/70 transition-all"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-3 whitespace-nowrap">
                      {row[col.key]}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No data found
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </div>
    </motion.div>
  );
}
