import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; // im not sure if it'll work
import { axiosInstance } from "../../axios-instance/axios-instance";
import { CiClock2 } from "react-icons/ci";

export default function TimeLockWithdrawal() {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [lockStartDate, setLockStartDate] = useState("");
  const [lockEndDate, setLockEndDate] = useState("");
  const [lockedWithdrawals, setLockedWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDateInputs, setShowDateInputs] = useState(false);
  const [pendingUnlock, setPendingUnlock] = useState(null);

  useEffect(() => {
    const fetchLockedWithdrawals = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/locked-withdrawals");
        setLockedWithdrawals(data ?? []);
        toast.success("Locked withdrawals loaded successfully!", {
          position: "top-center",
        });
      } catch (error) {
        console.error("Error fetching locked withdrawals:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(
          error.response?.data?.message || "Failed to load locked withdrawals.",
          { position: "top-center" }
        );
        setLockedWithdrawals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLockedWithdrawals();
  }, []);

  const validateLock = () => {
    if (!withdrawalAmount || withdrawalAmount <= 0) {
      toast.error("Enter a minimum of ₦1,000.00", { position: "top-center" });
      return false;
    }
    if (withdrawalAmount < 1000) {
      toast.error("Enter a minimum of ₦1,000.00", { position: "top-center" });
      return false;
    }
    if (!lockStartDate || !lockEndDate) {
      toast.error("Please select lock start and end dates.", {
        position: "top-center",
      });
      return false;
    }

    const start = new Date(lockStartDate);
    const end = new Date(lockEndDate);
    const diffInMs = end.getTime() - start.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays <= 0 || diffInDays % 7 !== 0) {
      toast.error(
        "You can only lock your funds at 7-day intervals. Select a lock period that is a multiple of 7 days (e.g., 7, 14, 21, or 28 days).",
        { position: "top-center" }
      );
      return false;
    }

    return true;
  };

  const handleLockWithdrawal = async () => {
    if (!validateLock()) return;

    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/lock-withdrawal", {
        amount: Number(withdrawalAmount),
        lockStartDate,
        lockEndDate,
      });
      setLockedWithdrawals([...lockedWithdrawals, data.withdrawal]);
      toast.success("Funds locked successfully!", { position: "top-center" });
      setWithdrawalAmount("");
      setLockStartDate("");
      setLockEndDate("");
      setShowDateInputs(false);
    } catch (error) {
      console.error("Error locking withdrawal:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(
        error.response?.data?.message || "Failed to lock funds.",
        { position: "top-center" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockWithdrawal = async (withdrawal) => {
    const currentDate = new Date();
    const unlockDate = new Date(withdrawal.unlockDate);

    if (currentDate >= unlockDate) {
      await unlockWithdrawal(withdrawal.id, false);
    } else {
      setPendingUnlock(withdrawal);
      toast.warn(
        "The lock period has not yet expired. Unlocking now will incur a 3% fee. Proceed?",
        {
          position: "top-center",
          autoClose: false,
          onClose: () => setPendingUnlock(null),
          closeOnClick: false,
          draggable: false,
          closeButton: (
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded"
              onClick={() => handleStillUnlock()}
            >
              Unlock
            </button>
          ),
        }
      );
    }
  };

  const handleStillUnlock = async () => {
    if (pendingUnlock) {
      await unlockWithdrawal(pendingUnlock.id, true);
      setPendingUnlock(null);
      toast.dismiss();
    }
  };

  const unlockWithdrawal = async (withdrawalId, applyFee) => {
    setLoading(true);
    try {
      await axiosInstance.post("/unlock-withdrawal", { id: withdrawalId, applyFee });
      setLockedWithdrawals(
        lockedWithdrawals.filter((w) => w.id !== withdrawalId)
      );
      toast.success(
        applyFee
          ? "Withdrawal unlocked with a 3% fee!"
          : "Withdrawal unlocked successfully!",
        { position: "top-center" }
      );
    } catch (error) {
      console.error("Error unlocking withdrawal:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(
        error.response?.data?.message || "Failed to unlock withdrawal.",
        { position: "top-center" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelLock = () => {
    setWithdrawalAmount("");
    setLockStartDate("");
    setLockEndDate("");
    setShowDateInputs(false);
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-xl rounded-xl p-6 border border-blue-700 mb-10">
      <ToastContainer />
      <div className="flex items-center mb-6">
        <CiClock2 className="text-blue-400 mr-4" size={28} />
        <h2 className="text-2xl font-bold text-white">Lock Your Funds</h2>
      </div>

      <div className="space-y-6">
        {/* Lock Form */}
        <div className="bg-gray-800 shadow-md rounded-md p-4">
          <p className="text-sm font-semibold mb-4 text-white">
            Lock Funds for a Specific Period
          </p>
          <div className="space-y-4">
            <input
              type="number"
              className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Amount"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              onFocus={() => setShowDateInputs(true)}
              disabled={loading}
            />
            {showDateInputs && (
              <>
                <div className="space-y-2">
                  <label className="text-white text-sm">Lock Start Date:</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={lockStartDate}
                    onChange={(e) => setLockStartDate(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white text-sm">Lock End Date:</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={lockEndDate}
                    onChange={(e) => setLockEndDate(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleLockWithdrawal}
                    className="flex-1 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition disabled:bg-gray-600"
                    disabled={loading}
                  >
                    Lock Funds
                  </button>
                  <button
                    onClick={handleCancelLock}
                    className="flex-1 py-3 rounded-md text-white bg-red-600 hover:bg-red-700 transition disabled:bg-gray-600"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Locked Withdrawals */}
        <div className="bg-gray-800 text-white shadow-md rounded-md p-4">
          <h3 className="text-lg font-semibold mb-4">Locked Withdrawals</h3>
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
          ) : lockedWithdrawals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm mt-4 table-auto">
                <thead>
                  <tr className="border-b border-gray-600 text-gray-400">
                    <th className="py-3 px-4 text-left">Date & Time</th>
                    <th className="py-3 px-4 text-left">Amount</th>
                    <th className="py-3 px-4 text-left">Lock Days</th>
                    <th className="py-3 px-4 text-left">Unlock Date</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lockedWithdrawals.map((txn) => (
                    <tr
                      key={txn.id}
                      className="border-t border-gray-700 hover:bg-gray-700/30 transition"
                    >
                      <td className="py-3 px-4">{new Date(txn.lockDate).toLocaleString()}</td>
                      <td className="py-3 px-4 font-semibold">
                        ₦{Number(txn.amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4">{txn.lockDays} days</td>
                      <td className="py-3 px-4">{new Date(txn.unlockDate).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            txn.status === "Locked"
                              ? "bg-yellow-600/20 text-yellow-400"
                              : "bg-green-600/20 text-green-400"
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {txn.status === "Locked" && (
                          <button
                            onClick={() => handleUnlockWithdrawal(txn)}
                            className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md text-xs disabled:bg-gray-600"
                            disabled={loading}
                          >
                            Unlock
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400">No withdrawals locked yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}