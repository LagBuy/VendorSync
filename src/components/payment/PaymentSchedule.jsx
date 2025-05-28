import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../axios-instance/axios-instance";
import Wallet from "./Wallet";

export default function PaymentSchedule() {
  const [withdrawalPeriod, setWithdrawalPeriod] = useState(7);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  const getBarColor = (amount) => {
    const minAmount = (totalAmount / 30) * 7;
    const maxAmount = totalAmount;
    const middleAmount = (minAmount + maxAmount) / 2;

    if (amount <= minAmount) return "bg-red-400";
    if (amount > minAmount && amount <= middleAmount) return "bg-yellow-400";
    if (amount > middleAmount && amount < maxAmount) return "bg-green-400";
    return "bg-white";
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    });
  };

  const calculateAmountForPeriod = (days) => {
    return (totalAmount / 30) * days;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch total earnings
        const { data: earningsData } = await axiosInstance.get("/earnings");
        setTotalAmount(earningsData.totalEarnings ?? 0);

        // Fetch withdrawal period
        const { data: periodData } = await axiosInstance.get("/withdrawal-period");
        setWithdrawalPeriod(periodData.period ?? 7);

        toast.success("Payment schedule data loaded successfully!", {
          position: "top-center",
        });
      } catch (error) {
        console.error("Error fetching payment schedule data:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(
          error.response?.data?.message || "Failed to load payment schedule data.",
          { position: "top-center" }
        );
        setTotalAmount(0);
        setWithdrawalPeriod(7);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = async (e) => {
    const period = parseInt(e.target.value);
    setWithdrawalPeriod(period);

    try {
      await axiosInstance.patch("/withdrawal-period", { period });
      toast.success(`Withdrawal period set to ${period} days!`, {
        position: "top-center",
      });
      if (period === 30) {
        toast.info(`Total Payout: ${formatCurrency(totalAmount)}`, {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error updating withdrawal period:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(
        error.response?.data?.message || "Failed to update withdrawal period.",
        { position: "top-center" }
      );
      setWithdrawalPeriod(7); // Revert on error
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-xl rounded-xl p-6 border border-blue-700 mb-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-extrabold text-xl text-white">Payment Schedule</h2>
          <span className="text-sm text-gray-200">Last updated: Apr 2025</span>
        </div>

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
        ) : (
          <>
            <div className="mb-3">
              <label
                htmlFor="withdrawalPeriod"
                className="block text-sm text-gray-200 mb-3"
              >
                Select Withdrawal Period:
              </label>
              <select
                id="withdrawalPeriod"
                value={withdrawalPeriod}
                onChange={handleChange}
                className="w-full sm:w-44 bg-gray-800 text-white text-sm font-semibold p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              >
                <option value={7}>7 Days</option>
                <option value={14}>14 Days</option>
                <option value={21}>21 Days</option>
                <option value={28}>28 Days</option>
                <option value={30}>1 Month</option>
              </select>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {[7, 14, 21, 28, 30].map((period) => (
                <div
                  key={period}
                  className={`flex flex-col items-center justify-between group transform transition-all duration-300 ease-in-out ${
                    withdrawalPeriod === period ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div
                    className={`${getBarColor(
                      calculateAmountForPeriod(period)
                    )} w-16 rounded-t-lg transition-all duration-500 ease-in-out transform hover:scale-110 hover:shadow-xl`}
                    style={{
                      height: `${
                        totalAmount ? (calculateAmountForPeriod(period) / totalAmount) * 100 : 0
                      }px`,
                    }}
                    title={formatCurrency(calculateAmountForPeriod(period))}
                  ></div>
                  <span className="mt-4 text-sm text-white font-semibold">
                    {`Period: ${period} Days`}
                  </span>
                  {withdrawalPeriod === period && (
                    <span className="text-xs text-gray-300">
                      {formatCurrency(calculateAmountForPeriod(period))}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <Wallet selectedAmount={calculateAmountForPeriod(withdrawalPeriod)} />
          </>
        )}
      </div>
    </>
  );
}