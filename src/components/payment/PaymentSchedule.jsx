import { useState } from "react";
import Wallet from "./Wallet"; // Import Wallet component

export default function PaymentSchedule() {
  const [withdrawalPeriod, setWithdrawalPeriod] = useState(7);
  const [showToast, setShowToast] = useState(false);
  const totalAmount = 300000; // Total earnings

  const getBarColor = (amount) => {
    const minAmount = (totalAmount / 30) * 7; // 7 days
    const maxAmount = totalAmount; // 30 days
    const middleAmount = (minAmount + maxAmount) / 2; // Middle amount

    if (amount <= minAmount) return "bg-red-400"; // Lowest
    if (amount > minAmount && amount <= middleAmount) return "bg-yellow-400"; // Next higher
    if (amount > middleAmount && amount < maxAmount) return "bg-green-400"; // Higher
    return "bg-white"; // Highest
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    });
  };

  const handleChange = (e) => {
    const period = parseInt(e.target.value);
    setWithdrawalPeriod(period);

    if (period === 30) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  const calculateAmountForPeriod = (days) => {
    return (totalAmount / 30) * days; // Distribute the total amount over the 30-day period
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-xl rounded-xl p-6 border border-blue-700 mb-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-extrabold text-xl text-white">Payment Schedule</h2>
        <span className="text-sm text-gray-200">Last updated: Apr 2025</span>
      </div>

      <div className="mb-3">
        <label
          htmlFor="withdrawal-period"
          className="block text-sm text-gray-200 mb-3"
        >
          Select Withdrawal Period:
        </label>
        <select
          id="withdrawal-period"
          value={withdrawalPeriod}
          onChange={handleChange}
          className="w-full sm:w-44 bg-gray-800 text-white text-sm p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value={7}>7 Days</option>
          <option value={14}>14 Days</option>
          <option value={21}>21 Days</option>
          <option value={28}>28 Days</option>
          <option value={30}>1 Month</option>
        </select>
      </div>

      <div className="grid grid-cols-5 gap-1">
        {/* Display bar for each period, only show the selected one */}
        {[7, 14, 21, 28, 30].map((period) => (
          <div
            key={period}
            className={`flex flex-col items-center justify-center group transform transition-all duration-300 ease-in-out ${
              withdrawalPeriod === period ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`${getBarColor(
                calculateAmountForPeriod(period)
              )} w-16 rounded-t-lg transition-all duration-500 ease-in-out transform hover:scale-110 hover:shadow-xl`}
              style={{
                height: `${
                  (calculateAmountForPeriod(period) / totalAmount) * 100
                }px`, // Adjust height based on the amount
              }}
              title={formatCurrency(calculateAmountForPeriod(period))}
            ></div>
            <span className="mt-4 text-sm text-white font-semibold">
              {`Period: ${period} Days`}
            </span>
            {/* Only show the amount when the corresponding period is selected */}
            {withdrawalPeriod === period && (
              <span className="text-xs text-gray-300">
                {formatCurrency(calculateAmountForPeriod(period))}
              </span>
            )}
          </div>
        ))}
      </div>

      {showToast && withdrawalPeriod === 30 && (
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gradient-to-r from-green-700 to-green-700 text-white font-semibold animate-pulse">
          Total Payout: {formatCurrency(totalAmount)}{" "}
          {/* Show total earnings for 1 month */}
        </div>
      )}

      <Wallet selectedAmount={calculateAmountForPeriod(withdrawalPeriod)} />
    </div>
  );
}
