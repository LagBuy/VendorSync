import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../axios-instance/axios-instance";
import {
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  Download,
  Sparkles,
  Filter,
  Search,
  Zap,
} from "lucide-react";

export default function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/transactions");
        const formattedData = data.map((txn) => ({
          id: txn.id || Math.random(),
          date: txn.date,
          time: txn.time,
          type: txn.type,
          amount: `₦${Number(txn.amount ?? 0).toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          desc: txn.desc,
          status: txn.status,
          direction: txn.direction,
          attachment: txn.attachment,
          rawAmount: txn.amount ?? 0,
        }));
        setTransactions(formattedData);
        setFilteredTransactions(formattedData);
      } catch {
        setTransactions([]);
        setFilteredTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions based on search and filters
  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(
        (txn) =>
          txn.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          txn.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          txn.amount.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((txn) => txn.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((txn) => txn.direction === typeFilter);
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, statusFilter, typeFilter, transactions]);

  const statusBadge = (status) => {
    const base =
      "px-3 py-1 rounded-xl text-xs font-semibold border backdrop-blur-sm";
    if (status === "Completed")
      return `${base} bg-green-500/20 text-green-400 border-green-500/30`;
    if (status === "Pending")
      return `${base} bg-yellow-500/20 text-yellow-400 border-yellow-500/30`;
    if (status === "Failed")
      return `${base} bg-red-500/20 text-red-400 border-red-500/30`;
    return `${base} bg-gray-600/20 text-gray-300 border-gray-600/30`;
  };

  const getIcon = (direction) =>
    direction === "in" ? (
      <motion.div
        className="w-10 h-10 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowDownLeft className="text-green-500 w-5 h-5" />
      </motion.div>
    ) : (
      <motion.div
        className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUpRight className="text-red-500 w-5 h-5" />
      </motion.div>
    );

  const getTotalAmount = () => {
    return filteredTransactions.reduce((sum, txn) => sum + txn.rawAmount, 0);
  };

  return (
    <motion.div
      className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-8 border-2 border-green-400/50 backdrop-blur-sm mb-10 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-yellow-400"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-xl"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center mb-4 lg:mb-0">
            <FileText className="mr-3 text-yellow-500" size={28} />
            <div>
              <h2 className="text-2xl font-bold text-white">
                Transaction History
              </h2>
              <p className="text-gray-400 text-sm">
                Track all your financial activities
              </p>
            </div>
          </div>
          {!loading && (
            <div className="flex items-center text-green-500 text-sm">
              <Sparkles size={16} className="mr-1" />
              <span>Live Data</span>
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border-2 border-gray-700 rounded-2xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none transition-colors duration-300"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800 border-2 border-gray-700 rounded-2xl px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors duration-300"
          >
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-gray-800 border-2 border-gray-700 rounded-2xl px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors duration-300"
          >
            <option value="all">All Types</option>
            <option value="in">Income</option>
            <option value="out">Expense</option>
          </select>

          {/* Reset Filters */}
          <motion.button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setTypeFilter("all");
            }}
            className="flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold py-3 px-4 rounded-2xl border-2 border-gray-600 hover:border-green-400/50 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter size={16} className="mr-2" />
            Reset Filters
          </motion.button>
        </div>

        {/* Summary Card */}
        {!loading && filteredTransactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-500/10 to-green-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="text-yellow-500 mr-3" size={20} />
                <div>
                  <h4 className="text-white font-semibold">
                    Transactions Summary
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {filteredTransactions.length} transactions found
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-yellow-500 font-bold text-lg">
                  ₦{getTotalAmount().toLocaleString("en-NG")}
                </p>
                <p className="text-gray-400 text-sm">Total Amount</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border-2 border-gray-700">
          {loading ? (
            // Enhanced Loading State
            <div className="p-8">
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 animate-pulse"
                  >
                    <div className="w-10 h-10 bg-gray-800 rounded-2xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                    </div>
                    <div className="w-20 h-8 bg-gray-800 rounded-xl"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="text-yellow-500" size={32} />
              </div>
              <h3 className="text-white font-semibold text-xl mb-2">
                No Transactions Found
              </h3>
              <p className="text-gray-400 max-w-sm mx-auto mb-4">
                {transactions.length === 0
                  ? "No transactions available yet. Transactions will appear here once you start processing payments."
                  : "No transactions match your current filters. Try adjusting your search criteria."}
              </p>
              {transactions.length > 0 && (
                <motion.button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-green-400 hover:to-green-500 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset All Filters
                </motion.button>
              )}
            </motion.div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
                  <th className="py-4 px-6 text-left text-green-400 font-semibold text-sm uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="py-4 px-6 text-left text-green-400 font-semibold text-sm uppercase tracking-wider">
                    Type
                  </th>
                  <th className="py-4 px-6 text-left text-green-400 font-semibold text-sm uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="py-4 px-6 text-left text-green-400 font-semibold text-sm uppercase tracking-wider">
                    Description
                  </th>
                  <th className="py-4 px-6 text-left text-green-400 font-semibold text-sm uppercase tracking-wider">
                    Attachment
                  </th>
                  <th className="py-4 px-6 text-left text-green-400 font-semibold text-sm uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredTransactions.map((txn, idx) => (
                    <motion.tr
                      key={txn.id}
                      className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors duration-300 group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">
                            {txn.date}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {txn.time}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          {getIcon(txn.direction)}
                          <span className="text-white font-medium">
                            {txn.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`font-bold text-lg ${
                            txn.direction === "in"
                              ? "text-green-500"
                              : "text-red-400"
                          }`}
                        >
                          {txn.amount}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-300">{txn.desc}</span>
                      </td>
                      <td className="py-4 px-6">
                        {txn.attachment ? (
                          <motion.a
                            href={`/attachments/${txn.attachment}`}
                            download
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 text-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Download size={14} />
                            Download
                          </motion.a>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No attachment
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <motion.span
                          className={statusBadge(txn.status)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {txn.status}
                        </motion.span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Stats */}
        {!loading && filteredTransactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 pt-6 border-t border-gray-800"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-yellow-500 font-bold text-lg">
                  {transactions.length}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-green-500 font-bold text-lg">
                  {transactions.filter((t) => t.status === "Completed").length}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-yellow-500 font-bold text-lg">
                  {transactions.filter((t) => t.status === "Pending").length}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Income</p>
                <p className="text-green-500 font-bold text-lg">
                  {transactions.filter((t) => t.direction === "in").length}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
