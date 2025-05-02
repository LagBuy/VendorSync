import { FaArrowUp, FaDollarSign, FaUserCheck } from "react-icons/fa";

export default function QuickStats() {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg border border-gray-600">
      <h2 className="text-white text-xl font-semibold mb-8">
        Quick Statistics
      </h2>

      <div className="flex items-center text-white text-sm mb-6">
        <FaUserCheck className="text-green-500 mr-4 text-2xl" />
        <div className="flex flex-col">
          <span className="text-gray-400">Selected Vendors</span>
          <strong className="text-xl text-white">303 in total</strong>
        </div>
      </div>

      <div className="flex items-center text-white text-sm mb-6">
        <FaDollarSign className="text-yellow-500 mr-4 text-2xl" />
        <div className="flex flex-col">
          <span className="text-gray-400">Your Status</span>
          <strong className="text-xl text-green-500">selected✅</strong>
        </div>
      </div>

      <div className="flex items-center text-white text-sm mb-8">
        <FaArrowUp className="text-yellow-400 mr-4 text-2xl" />
        <div className="flex flex-col">
          <span className="text-gray-400">Your Position</span>
          <strong className="text-xl text-yellow-500">
            top 13% of vendors💃🏻
          </strong>
        </div>
      </div>

      <button className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 ease-in-out transform">
        Read More
      </button>
    </div>
  );
}
