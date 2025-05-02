import { ArrowDownLeft, ArrowUpRight, FileText } from "lucide-react";

export default function TransactionTable() {
  const transactions = [
    {
      date: "Apr 20, 2025",
      time: "11:30 AM",
      type: "Payment",
      amount: "₦50,000",
      desc: "Vendor payout for completed orders",
      status: "Completed",
      direction: "in",
      attachment: "invoice.pdf",
    },
    {
      date: "Apr 18, 2025",
      time: "02:15 PM",
      type: "Withdrawal",
      amount: "₦20,000",
      desc: "Vendor bank withdrawal",
      status: "Completed",
      direction: "out",
      attachment: "statement.pdf",
    },
    {
      date: "Apr 16, 2025",
      time: "09:45 AM",
      type: "Payout",
      amount: "₦30,000",
      desc: "Scheduled weekly payout",
      status: "Pending",
      direction: "out",
      attachment: "receipt.pdf",
    },
    {
      date: "Apr 15, 2025",
      time: "03:00 PM",
      type: "Refund",
      amount: "₦10,000",
      desc: "Refund to customer",
      status: "Failed",
      direction: "out",
      attachment: "refund.pdf",
    },
  ];

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
      <p className="text-lg font-bold mb-6 text-white">Recent Transactions</p>
      <div className="overflow-x-auto">
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
      </div>
    </div>
  );
}
