import { useParams, useNavigate } from "react-router-dom";

const allPlans = {
  free: {
    title: "Free",
    price: "₦0.00",
    note: "NGN/Month",
    features: [
      "List up to 10 products(enough to test the platform)",
      "Products show up in general search results, but not at the top",
      "Basic customer support(emails only)",
      "Participate in monthly general promotions",
      "SEO basics(your store can still be found on Google",
      "No access to educational resources(e.g, know-how-sell guide)",
    ],
  },
  basic: {
    title: "Basic",
    price: "₦5,000.00",
    note: "NGN/Month",
    features: [
      "List up to 25 products",
      "Products show up in general search results",
      "Basic customer support(emails only)",
      "participate in monthly general promotions",
      "SEO basics(your store can be found on Google",
      "Limited access to educational resources(e.g, know-how-sell guide)",
    ],
  },
  standard: {
    title: "Standard",
    price: "₦10,000.00",
    note: "NGN/Month",
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
  premium: {
    title: "Premium",
    price: "₦20,000.00",
    note: "NGN/Month",
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
};

const PlanDetails = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const plan = allPlans[planId];

  if (!plan) {
    return <p className="text-white">Plan not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-gray-900 text-white rounded-xl p-8 shadow-lg border border-blue-700">
      <h1 className="text-3xl font-bold mb-2">{plan.title} Plan</h1>
      <p className="text-xl text-green-400 mb-2">{plan.price}</p>
      <p className="text-sm text-gray-300 mb-6">{plan.note}</p>
      <ul className="space-y-2 mb-8">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start">
            <span className="text-green-400 mr-2 mt-1">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => navigate(-1)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
      >
        ← Back to Plans
      </button>
    </div>
  );
};

export default PlanDetails;
