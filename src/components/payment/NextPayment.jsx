export default function NextPayments() {
  const nextPayment = {
    amount: "₦143,918.24",
    dueDate: "August 05, 2025",
    progress: 75, // Progress in percentage
    status: "Due soon",
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl border border-gray-700 p-6">
      <h2 className="font-semibold text-xl text-white mb-3">Next Payment</h2>

      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400 text-sm">Amount Due</p>
        <p className="text-white text-lg font-semibold">{nextPayment.amount}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400 text-sm">Due Date</p>
        <p className="text-white text-lg font-semibold">
          {nextPayment.dueDate}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-gray-400 text-sm">Payment Status</p>
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full ${
              nextPayment.status === "Due soon"
                ? "bg-yellow-400"
                : "bg-green-400"
            } mr-2`}
          />
          <p className="text-white">{nextPayment.status}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-400 text-sm mb-2">Payment Progress</p>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
          <div
            className="bg-blue-500 h-2.5 rounded-full"
            style={{ width: `${nextPayment.progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-300 text-right">
          {nextPayment.progress}% Completed
        </p>
      </div>

      <button className="mt-4 text-blue-600 text-sm underline hover:text-blue-500">
        View all upcoming payments
      </button>
    </div>
  );
}
