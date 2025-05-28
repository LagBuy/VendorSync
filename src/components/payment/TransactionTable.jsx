import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { ArrowDownLeft, ArrowUpRight, FileText } from "lucide-react";

export default function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/transactions");
        setTransactions(
          data.map((txn) => ({
            date: txn.date,
            time: txn.time,
            type: txn.type,
            amount: `₦${Number(txn.amount ?? 0).toLocaleString('en-NG', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            desc: txn.desc,
            status: txn.status,
            direction: txn.direction,
            attachment: txn.attachment,
          }))
        );
        toast.success("Transactions loaded successfully!", {
          position: "top-center",
        });
      } catch (error) {
        console.error("Error fetching transactions:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(
          error.response?.data?.message || "Failed to load transactions.",
          { position: "top-center" }
        );
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const statusBadge = (status) => {
    const base = "px-3 py-1 rounded-xl text-xs font-semibold";
    if (status === "Completed") return `${base} bg-green-600/20 text-green-400`;
    if (status === "Pending") return `${base} bg-yellow-600/20 text-yellow-400`;
    if (status === "Failed") return `${base} bg-red-600/20 text-red-400`;
    return `${base} bg-gray-600/20 text-gray-300`;
  };

  const getIcon = (direction) =>
    direction === "in" ? (
      <ArrowDownLeft className="text-green-500 w-5 h-5 mr-2" />
    ) : (
      <ArrowUpRight className="text-red-500 w-5 h-5 mr-2" />
    );

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-xl rounded-xl p-6 border border-blue-700 mb-10">
      <ToastContainer />
      <p className="text-lg font-bold mb-6 text-white">Recent Transactions</p>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-6">
            <svg
              className="animate-spin h-8 w-8 text-white mx-auto"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            No transactions found.
          </div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-600 text-gray-400">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Attachment</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-700 hover:bg-gray-700/30 transition"
                >
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="text-white">{txn.date}</span>
                      <span className="text-gray-400 text-xs">{txn.time}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 flex items-center">
                    {getIcon(txn.direction)}
                    <span className="text-white">{txn.type}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">
                    {txn.amount}
                  </td>
                  <td className="py-3 px-4 text-gray-300">{txn.desc}</td>
                  <td className="py-3 px-4">
                    <a
                      href={`/attachments/${txn.attachment}`}
                      download
                      className="flex items-center gap-2 text-blue-400 hover:underline text-xs"
                    >
                      <FileText className="w-4 h-4" />
                      {txn.attachment}
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    <span className={statusBadge(txn.status)}>{txn.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}