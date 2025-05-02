import { useState } from "react";
import { FaChartLine } from "react-icons/fa";

const plans = [
  {
    title: "Free",
    price: "₦0.00",
    note: "NGN/Month",
    description: "Explore how LagBuy can boost your business daily.",
    current: true,
    features: [
      "List up to 10 products(enough to test the platform)",
      "Products show up in general search results, but not at the top",
      "Basic customer support(emails only)",
      "Participate in monthly general promotions",
      "SEO basics(your store can still be found on Google",
      "No access to educational resources(e.g, know-how-sell guide)",
    ],
  },
  {
    title: "Basic",
    price: "₦5,000.00",
    note: "NGN/Month",
    description: "Boost sales with more access.",
    popular: true,
    features: [
      "List up to 25 products",
      "Products show up in general search results",
      "Basic customer support(emails only)",
      "participate in monthly general promotions",
      "SEO basics(your store can be found on Google",
      "Limited access to educational resources(e.g, know-how-sell guide)",
    ],
  },
  {
    title: "Standard",
    price: "₦10,000.00",
    note: "NGN/Month",
    description: "Power your creativity, sales, profits and efficiency.",
    features: [
      "All Basic features, plus",
      "List up to 65 products/services",
      "Featured product placement(small boost in search results)",
      "Access to exclusive marketing webinars and tutorials",
      "Ability to run limited paid ads within the platform",
      "Discount and coupon tools for your customers",
      "Loyalty reward program for your buyers",
    ],
  },
  {
    title: "Premium",
    price: "₦20,000.00",
    note: "NGN/Month",
    description: "Get full power and unlimited access.",
    features: [
      "Everything in Standard, plus",
      "Unlimited product/service listing",
      "Top priority placement in product search results",
      "Email marketing tools (send campaigns to customers",
      "24/7 Customer Support",
      "Free ads for you every month",
      "Early access to new features",
      "Invitation to platform-exclusive sales events",
      "Priority payouts",
      "You enjoy future benefits first",
    ],
  },
];

const SubscriptionPlans = () => {
  const [index, setIndex] = useState(0);
  const [showPlans, setShowPlans] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const plan = plans[index];

  const handleNext = () => {
    if (index < plans.length - 1) setIndex(index + 1);
  };

  const handleBack = () => {
    if (index > 0) setIndex(index - 1);
  };

  const togglePlans = () => setShowPlans(!showPlans);

  const closePlans = () => setShowPlans(false);

  const showPayment = () => setShowPaymentForm(true);

  const closePayment = () => setShowPaymentForm(false);

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-2xl rounded-2xl p-8 mb-10 border border-blue-700">
      <div className="flex items-center mb-6">
        <FaChartLine className="text-blue-400 mr-4" size={28} />
        <h2 className="text-2xl font-bold text-white">Subscription Plans</h2>
      </div>

      <p className="text-gray-300 mb-6">
        Choose the plan that fits your goals and unlock premium features.
      </p>

      {!showPlans ? (
        <button
          onClick={togglePlans}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl font-semibold transition"
        >
          View Plans
        </button>
      ) : (
        <div className="w-full max-w-2xl">
          <div
            className={`rounded-2xl p-8 transition-all ${
              plan.popular ? "bg-blue-700" : "bg-gray-800"
            }`}
          >
            {plan.popular && (
              <div className="text-white text-xs font-bold tracking-widest mb-3">
                MOST POPULAR
              </div>
            )}
            <h2 className="text-3xl font-bold text-white mb-2">{plan.title}</h2>
            <p className="text-2xl text-white mb-1">{plan.price}</p>
            <p className="text-sm text-gray-300 mb-6">{plan.note}</p>

            <p className="text-gray-400 mb-6">{plan.description}</p>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-gray-200">
                  <span className="text-green-400 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={showPayment}
              disabled={plan.current}
              className={`w-full p-2 rounded-xl font-bold text-white transition ${
                plan.current
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {plan.current ? "Current Plan" : `Subscribe`}
            </button>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handleBack}
                disabled={index === 0}
                className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full text-white disabled:opacity-40"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                disabled={index === plans.length - 1}
                className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full text-white disabled:opacity-40"
              >
                →
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={closePlans}
                className="text-red-400 hover:text-red-500 font-bold text-sm underline"
              >
                Close Plans
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-8 w-96">
            <h3 className="text-2xl font-bold text-white mb-6">
              Payment Details
            </h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Card Number"
                className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none"
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-1/2 p-3 rounded-md bg-gray-700 text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="w-1/2 p-3 rounded-md bg-gray-700 text-white focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-full font-bold text-white"
              >
                Complete Payment
              </button>
            </form>
            <div className="text-center mt-6">
              <button
                onClick={closePayment}
                className="text-red-400 hover:text-red-500 font-bold text-sm underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
