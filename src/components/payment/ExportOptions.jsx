export default function ExportOptions() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-800 p-6 rounded-xl shadow-lg">
      <p className="text-xl text-gray-300 font-bold">Export:</p>
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-blue-600 text-sm text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Download CSV
        </button>
        <button className="px-4 py-2 bg-blue-600 text-sm text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Download PDF
        </button>
      </div>
    </div>
  );
}
