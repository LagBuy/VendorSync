import { DollarSign, Clock, Wallet, ArrowDownCircle } from "lucide-react";

export default function OverviewCards() {
  const stats = [
    {
      title: "Total Revenue",
      amount: "₦300,000",
      icon: DollarSign,
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "Pending Cashout",
      amount: "₦50,000",
      icon: Clock,
      color: "bg-yellow-500/10 text-yellow-500",
    },
    {
      title: "Available Balance",
      amount: "₦250,000",
      icon: Wallet,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Withdrawn",
      amount: "₦100,000",
      icon: ArrowDownCircle,
      color: "bg-red-500/10 text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg transition-transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full ${item.color}`}
            >
              <item.icon className="w-6 h-6" />
            </div>
          </div>
          <p className="text-gray-400 text-sm">{item.title}</p>
          <p className="text-2xl font-bold text-white mt-1">{item.amount}</p>
        </div>
      ))}
    </div>
  );
}
