import { useState, useEffect } from "react";
import { GoGitPullRequestDraft } from "react-icons/go";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OfflineWithdrawal() {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [isOffline, setIsOffline] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState([]);
  const [queuedWithdrawal, setQueuedWithdrawal] = useState(null); // Store the current queued withdrawal
  const scheduledAmount = 10000; // Example of scheduled amount, you can set it dynamically based on your business logic.

  // Handle withdrawal request
  const handleWithdrawRequest = () => {
    if (
      !withdrawalAmount ||
      withdrawalAmount <= 0 ||
      withdrawalAmount > scheduledAmount
    ) {
      toast.error(
        "Please enter an amount equal to or less than the scheduled amount."
      );
      return; // Don't proceed if no amount is entered or if it's invalid
    }

    // Clear previous queued withdrawal
    const previousWithdrawals =
      JSON.parse(localStorage.getItem("queuedWithdrawals")) || [];
    if (previousWithdrawals.length > 0) {
      // Remove previous withdrawal from localStorage and state
      localStorage.removeItem("queuedWithdrawals");
      setWithdrawalData([]);
    }

    const newWithdrawal = {
      amount: withdrawalAmount,
      date: new Date().toLocaleString(),
      status: "Queued", // Initially queued, not processed
    };

    // Save new withdrawal in localStorage
    const updatedWithdrawals = [newWithdrawal];
    localStorage.setItem(
      "queuedWithdrawals",
      JSON.stringify(updatedWithdrawals)
    );

    // Update the state with new queued withdrawal
    setWithdrawalData(updatedWithdrawals);
    setQueuedWithdrawal(newWithdrawal); // Set the current queued withdrawal
    setWithdrawalAmount(""); // Clear input after withdrawal request
  };

  // Cancel queued withdrawal
  const handleCancelQueue = () => {
    // Remove the current queued withdrawal from the localStorage
    const updatedWithdrawals =
      JSON.parse(localStorage.getItem("queuedWithdrawals")) || [];
    const filteredWithdrawals = updatedWithdrawals.filter(
      (txn) =>
        txn.amount !== queuedWithdrawal.amount ||
        txn.date !== queuedWithdrawal.date
    );
    localStorage.setItem(
      "queuedWithdrawals",
      JSON.stringify(filteredWithdrawals)
    );

    // Remove queued withdrawal from state
    setQueuedWithdrawal(null);
    setWithdrawalData(filteredWithdrawals); // Update the displayed withdrawal data
  };

  // Check online/offline status
  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
    };

    const handleOnline = () => {
      setIsOffline(false);
      syncWithdrawals(); // Sync queued withdrawals when back online
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  // Mock function to sync offline withdrawals with the server
  const syncWithdrawals = () => {
    const queuedWithdrawals =
      JSON.parse(localStorage.getItem("queuedWithdrawals")) || [];

    if (queuedWithdrawals.length > 0) {
      // Simulate syncing with the server
      setTimeout(() => {
        console.log("Syncing offline withdrawals with the server...");
        // After syncing, remove the withdrawals from localStorage
        localStorage.removeItem("queuedWithdrawals");
        // Update withdrawal statuses to 'Processed'
        const processedWithdrawals = queuedWithdrawals.map((w) => ({
          ...w,
          status: "Processed",
        }));
        setWithdrawalData(processedWithdrawals);
        alert("Withdrawals synced and processed successfully!");
      }, 2000);
    }
  };

  // Load queued withdrawals on component mount
  useEffect(() => {
    const savedWithdrawals =
      JSON.parse(localStorage.getItem("queuedWithdrawals")) || [];
    setWithdrawalData(savedWithdrawals);
  }, []);

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-xl rounded-xl p-6 border border-blue-700 mb-10">
      {/* <GoGitPullRequestDraft />
      <p className="text-lg font-bold mb-6 text-white">Queue Withdrawal</p> */}

      <div className="flex items-center mb-6">
        <GoGitPullRequestDraft className="text-blue-400 mr-4" size={28} />
        <h2 className="text-2xl font-bold text-white">Queue Withdrawal</h2>
      </div>

      <div className="space-y-6">
        {/* Withdrawal Request Form */}
        <div className="bg-gray-800 shadow-md rounded-md p-4">
          <p className="text-sm font-semibold mb-4 text-white-100">
            Request a later withdrawal
          </p>
          <div className="space-y-4">
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              placeholder="Enter Amount"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
            />
            <button
              onClick={handleWithdrawRequest}
              className={`w-full py-3 rounded-md text-white ${
                isOffline ? "bg-blue-600" : "bg-blue-600"
              }`}
              disabled={
                isOffline && (!withdrawalAmount || withdrawalAmount <= 0)
              }
            >
              {isOffline ? "Queue Withdrawal (Offline)" : "Request Withdrawal"}
            </button>
          </div>
        </div>

        {/* Display Withdrawals */}
        <div className="bg-gray-800 text-white shadow-md rounded-md p-4">
          <h3 className="text-lg font-semibold mb-4">Queued Withdrawals</h3>
          {queuedWithdrawal ? (
            <div className="bg-yellow-600/20 text-yellow-400 p-3 rounded-md">
              <p className="text-sm font-semibold">
                Amount: ₦{queuedWithdrawal.amount}
              </p>
              <p className="text-xs">Status: {queuedWithdrawal.status}</p>
              <button
                onClick={handleCancelQueue}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-xs"
              >
                Cancel Queue
              </button>
            </div>
          ) : (
            <p className="text-gray-400">No withdrawal queued yet</p>
          )}

          {withdrawalData.length > 0 && !queuedWithdrawal && (
            <table className="min-w-full text-sm mt-4">
              <thead>
                <tr className="border-b border-gray-600 text-gray-400">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawalData.map((txn, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-gray-700 hover:bg-gray-700/30 transition"
                  >
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-white">{txn.date}</span>
                        <span className="text-gray-400 text-xs">
                          {txn.time}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {txn.amount}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          txn.status === "Queued"
                            ? "bg-yellow-600/20 text-yellow-400"
                            : "bg-green-600/20 text-green-400"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
