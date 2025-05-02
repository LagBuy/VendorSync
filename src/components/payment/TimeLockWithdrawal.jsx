import { useState, useEffect } from "react";
import { CiClock2 } from "react-icons/ci";

export default function TimeLockWithdrawal() {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [lockStartDate, setLockStartDate] = useState("");
  const [lockEndDate, setLockEndDate] = useState("");
  const [lockedWithdrawals, setLockedWithdrawals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [pendingUnlock, setPendingUnlock] = useState(null);
  const [showDateInputs, setShowDateInputs] = useState(false);

  const handleLockWithdrawal = () => {
    if (!withdrawalAmount || withdrawalAmount <= 0) {
      showModalMessage("Enter a minimum of ₦1,000.00", "error");
      return;
    }

    if (withdrawalAmount < 1000) {
      showModalMessage("Enter a minimum of ₦1,000.00", "error");
      return;
    }

    if (!lockStartDate || !lockEndDate) {
      showModalMessage("Please select lock start and end dates.", "error");
      return;
    }

    const start = new Date(lockStartDate);
    const end = new Date(lockEndDate);

    const diffInMs = end.getTime() - start.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays <= 0 || diffInDays % 7 !== 0) {
      showModalMessage(
        "You can only lock your funds at 7 days interval. So, select a lock-start and lock-end date that follows a 7-day range. It could be 7 days, 14 days, 21 days, 28 days and so on.",
        "error"
      );
      return;
    }

    const newLockedWithdrawal = {
      amount: withdrawalAmount,
      lockDate: start.toLocaleString(),
      unlockDate: end.toLocaleString(),
      lockDays: diffInDays,
      status: "Locked",
    };

    const updatedLockedWithdrawals = [
      ...lockedWithdrawals,
      newLockedWithdrawal,
    ];
    localStorage.setItem(
      "lockedWithdrawals",
      JSON.stringify(updatedLockedWithdrawals)
    );

    setLockedWithdrawals(updatedLockedWithdrawals);
    setWithdrawalAmount("");
    setLockStartDate("");
    setLockEndDate("");
    setShowDateInputs(false); // Hide date inputs after successful lock
  };

  const handleUnlockWithdrawal = (withdrawal) => {
    const currentDate = new Date();
    const unlockDate = new Date(withdrawal.unlockDate);

    if (currentDate >= unlockDate) {
      clearAllLockedWithdrawals();
      showModalMessage("Withdrawal unlocked successfully!", "success");
    } else {
      setPendingUnlock(withdrawal);
      showModalMessage(
        "The lock period has not yet expired. Unlocking now will incur a 3% fee.",
        "warning"
      );
    }
  };

  const handleStillUnlock = () => {
    if (pendingUnlock) {
      clearAllLockedWithdrawals();
      showModalMessage("Withdrawal unlocked with a 3% fee!", "success");
      setPendingUnlock(null);
    }
  };

  const clearAllLockedWithdrawals = () => {
    setLockedWithdrawals([]);
    localStorage.removeItem("lockedWithdrawals");
  };

  const showModalMessage = (message, type) => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCancelLock = () => {
    setWithdrawalAmount("");
    setLockStartDate("");
    setLockEndDate("");
    setShowDateInputs(false);
  };

  useEffect(() => {
    const savedLockedWithdrawals =
      JSON.parse(localStorage.getItem("lockedWithdrawals")) || [];
    setLockedWithdrawals(savedLockedWithdrawals);
  }, []);

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-xl rounded-xl p-6 border border-blue-700 mb-10">
      <div className="flex items-center mb-6">
        <CiClock2 className="text-blue-400 mr-4" size={28} />
        <h2 className="text-2xl font-bold text-white">Lock Your Funds</h2>
      </div>

      <div className="space-y-6">
        {/* Lock Form */}
        <div className="bg-gray-800 shadow-md rounded-md p-4">
          <p className="text-sm font-semibold mb-4 text-white-100">
            Lock Funds for a Specific Period
          </p>
          <div className="space-y-4">
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              placeholder="Enter Amount"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              onFocus={() => setShowDateInputs(true)}
            />
            {showDateInputs && (
              <>
                <div className="space-y-2">
                  <label className="text-white">Lock Start Date:</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
                    value={lockStartDate}
                    onChange={(e) => setLockStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white">Lock End Date:</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
                    value={lockEndDate}
                    onChange={(e) => setLockEndDate(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleLockWithdrawal}
                    className="flex-1 py-3 rounded-md text-white bg-blue-600"
                  >
                    Lock Funds
                  </button>
                  <button
                    onClick={handleCancelLock}
                    className="flex-1 py-3 rounded-md text-white bg-red-600"
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
          {lockedWithdrawals.length > 0 ? (
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
                  {lockedWithdrawals.map((txn, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-gray-700 hover:bg-gray-700/30 transition"
                    >
                      <td className="py-3 px-4">{txn.lockDate}</td>
                      <td className="py-3 px-4 font-semibold">₦{txn.amount}</td>
                      <td className="py-3 px-4">{txn.lockDays} days</td>
                      <td className="py-3 px-4">{txn.unlockDate}</td>
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
                            className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md text-xs"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-80 max-w-sm">
            <div
              className={`text-center ${
                modalType === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              <p className="text-lg font-semibold">{modalMessage}</p>
              {modalType === "warning" && (
                <button
                  onClick={handleStillUnlock}
                  className="mt-4 w-full py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Still Unlock
                </button>
              )}
              <button
                onClick={closeModal}
                className="mt-4 w-full py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
