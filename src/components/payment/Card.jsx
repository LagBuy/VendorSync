export default function Card() {
  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 p-6">
      <div className="bg-white shadow rounded-xl p-4 mb-8">
        <p className="text-lg font-semibold mb-2">Bank Account Info</p>
        <div className="text-sm text-gray-700">
          <p>Bank: GTBank</p>
          <p>Account Name: John Vendor</p>
          <p>Account Number: 0123456789</p>
        </div>
      </div>
    </div>
  );
}
