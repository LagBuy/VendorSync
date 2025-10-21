import { useState, useEffect } from "react";
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
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success', 'error', 'warning'

  useEffect(() => {
    const fetchLockedWithdrawals = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/locked-withdrawals");
        setLockedWithdrawals(data ?? []);
        showMessage("Locked withdrawals loaded successfully!", "success");
      } catch (error) {
        console.error("Error fetching locked withdrawals:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        showMessage(
          error.response?.data?.message || "Failed to load locked withdrawals.",
          "error"
        );
        setLockedWithdrawals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLockedWithdrawals();
  }, []);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3000);
  };

  const validateLock = () => {
    if (!withdrawalAmount || withdrawalAmount <= 0) {
      showMessage("Enter a minimum of ₦1,000.00", "error");
      return false;
    }
    if (withdrawalAmount < 1000) {
      showMessage("Enter a minimum of ₦1,000.00", "error");
      return false;
    }
    if (!lockStartDate || !lockEndDate) {
      showMessage("Please select lock start and end dates.", "error");
      return false;
    }

    const start = new Date(lockStartDate);
    const end = new Date(lockEndDate);
    const diffInMs = end.getTime() - start.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays <= 0 || diffInDays % 7 !== 0) {
      showMessage(
        "You can only lock your funds at 7-day intervals. Select a lock period that is a multiple of 7 days (e.g., 7, 14, 21, or 28 days).",
        "error"
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
      showMessage("Funds locked successfully!", "success");
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
      showMessage(
        error.response?.data?.message || "Failed to lock funds.",
        "error"
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
      showMessage(
        "The lock period has not yet expired. Unlocking now will incur a 3% fee. Do you want to proceed?",
        "warning"
      );
    }
  };

  const handleStillUnlock = async () => {
    if (pendingUnlock) {
      await unlockWithdrawal(pendingUnlock.id, true);
      setPendingUnlock(null);
    }
  };

  const unlockWithdrawal = async (withdrawalId, applyFee) => {
    setLoading(true);
    try {
      await axiosInstance.post("/unlock-withdrawal", {
        id: withdrawalId,
        applyFee,
      });
      setLockedWithdrawals(
        lockedWithdrawals.filter((w) => w.id !== withdrawalId)
      );
      showMessage(
        applyFee
          ? "Withdrawal unlocked with a 3% fee!"
          : "Withdrawal unlocked successfully!",
        "success"
      );
    } catch (error) {
      console.error("Error unlocking withdrawal:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      showMessage(
        error.response?.data?.message || "Failed to unlock withdrawal.",
        "error"
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

  const handleCancelUnlock = () => {
    setPendingUnlock(null);
    setMessage(null);
    setMessageType(null);
  };

  const getMessageStyles = () => {
    switch (messageType) {
      case "success":
        return "bg-green-500/20 border border-green-500/30 text-green-400";
      case "error":
        return "bg-yellow-500/20 border border-yellow-500/30 text-yellow-400";
      case "warning":
        return "bg-yellow-500/20 border border-yellow-500/30 text-yellow-400";
      default:
        return "bg-gray-500/20 border border-gray-500/30 text-gray-400";
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#111827] to-[#000000] shadow-xl rounded-xl p-6 border border-[#1F2937] mb-10 backdrop-blur-lg">
      {/* Custom Message Display */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl backdrop-blur-sm ${getMessageStyles()}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  messageType === "success"
                    ? "bg-green-500"
                    : messageType === "error"
                    ? "bg-yellow-500"
                    : "bg-yellow-500"
                }`}
              ></div>
              <p className="text-sm font-medium">{message}</p>
            </div>
            {messageType === "warning" && (
              <div className="flex gap-2 ml-4">
                <button
                  onClick={handleStillUnlock}
                  className="bg-yellow-500 text-black px-3 py-1 rounded-md text-sm font-medium hover:bg-yellow-600 transition-colors"
                >
                  Unlock
                </button>
                <button
                  onClick={handleCancelUnlock}
                  className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center mb-6">
        <div className="bg-yellow-500/10 p-2 rounded-lg border border-yellow-500/20 mr-4">
          <CiClock2 className="text-yellow-500" size={28} />
        </div>
        <h2 className="text-2xl font-bold text-white">Lock Your Funds</h2>
      </div>

      <div className="space-y-6">
        {/* Lock Form */}
        <div className="bg-gradient-to-br from-[#111827] to-[#000000] shadow-lg rounded-lg p-6 border border-[#1F2937]">
          <p className="text-sm font-semibold mb-4 text-white">
            Lock Funds for a Specific Period
          </p>
          <div className="space-y-4">
            <input
              type="number"
              className="w-full p-3 border border-[#1F2937] rounded-lg bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-colors placeholder-gray-400"
              placeholder="Enter Amount (Minimum ₦1,000)"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              onFocus={() => setShowDateInputs(true)}
              disabled={loading}
            />
            {showDateInputs && (
              <div className="space-y-4 p-4 bg-black/30 rounded-lg border border-[#1F2937]">
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">
                    Lock Start Date:
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border border-[#1F2937] rounded-lg bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-colors"
                    value={lockStartDate}
                    onChange={(e) => setLockStartDate(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">
                    Lock End Date:
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border border-[#1F2937] rounded-lg bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-colors"
                    value={lockEndDate}
                    onChange={(e) => setLockEndDate(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={handleLockWithdrawal}
                    className="flex-1 py-3 rounded-lg text-black bg-yellow-500 hover:bg-yellow-600 transition-colors disabled:bg-gray-600 disabled:text-gray-400 font-medium shadow-lg hover:shadow-yellow-500/20"
                    disabled={loading}
                  >
                    {loading ? "Locking..." : "Lock Funds"}
                  </button>
                  <button
                    onClick={handleCancelLock}
                    className="flex-1 py-3 rounded-lg text-white bg-[#1F2937] hover:bg-[#374151] border border-[#374151] transition-colors disabled:bg-gray-600 font-medium"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Locked Withdrawals */}
        <div className="bg-gradient-to-br from-[#111827] to-[#000000] shadow-lg rounded-lg p-6 border border-[#1F2937]">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Locked Withdrawals
          </h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">
                Loading locked withdrawals...
              </p>
            </div>
          ) : lockedWithdrawals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1F2937] text-gray-400">
                    <th className="py-4 px-4 text-left font-medium">
                      Date & Time
                    </th>
                    <th className="py-4 px-4 text-left font-medium">Amount</th>
                    <th className="py-4 px-4 text-left font-medium">
                      Lock Days
                    </th>
                    <th className="py-4 px-4 text-left font-medium">
                      Unlock Date
                    </th>
                    <th className="py-4 px-4 text-left font-medium">Status</th>
                    <th className="py-4 px-4 text-left font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lockedWithdrawals.map((txn) => (
                    <tr
                      key={txn.id}
                      className="border-t border-[#1F2937] hover:bg-yellow-500/5 transition-colors group"
                    >
                      <td className="py-4 px-4 text-white group-hover:text-yellow-500 transition-colors">
                        {new Date(txn.lockDate).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 font-semibold text-white">
                        ₦
                        {Number(txn.amount).toLocaleString("en-NG", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-4 px-4 text-gray-400">
                        {txn.lockDays} days
                      </td>
                      <td className="py-4 px-4 text-gray-400">
                        {new Date(txn.unlockDate).toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            txn.status === "Locked"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-green-500/20 text-green-400 border border-green-500/30"
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {txn.status === "Locked" && (
                          <button
                            onClick={() => handleUnlockWithdrawal(txn)}
                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors disabled:bg-gray-600 disabled:text-gray-400 shadow-lg hover:shadow-green-500/20"
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
            <div className="text-center py-8 border-2 border-dashed border-[#1F2937] rounded-lg">
              <CiClock2 className="text-gray-400 mx-auto mb-3" size={48} />
              <p className="text-gray-400 text-lg">No withdrawals locked yet</p>
              <p className="text-gray-500 text-sm mt-1">
                Lock your first withdrawal to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
