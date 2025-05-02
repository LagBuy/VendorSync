export default function CapitalNeeds() {
  return (
    <div className="bg-white shadow rounded-xl p-4 mb-8">
      <p className="text-lg font-semibold mb-4">Withdraw Funds</p>
      <form className="flex flex-col md:flex-row items-center gap-4">
        <input
          type="number"
          placeholder="Enter amount"
          className="w-full md:w-auto flex-1 px-4 py-2 border rounded-xl"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Withdraw
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-2">Minimum withdrawal: ₦5,000</p>
    </div>
  );
}
