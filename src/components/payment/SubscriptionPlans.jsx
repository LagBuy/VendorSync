import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { FaChartLine } from "react-icons/fa";

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState([]);
  const [index, setIndex] = useState(0);
  const [showPlans, setShowPlans] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/plans");
        setPlans(
          data.length
            ? data
            : [
                {
                  title: "Free",
                  price: 0,
                  note: "NGN/Month",
                  description: "No plans available.",
                  current: true,
                  popular: false,
                  features: ["Contact support for assistance."],
                },
              ]
        );
        toast.success("Subscription plans loaded successfully!", {
          position: "top-center",
        });
      } catch (error) {
        console.error("Error fetching plans:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(
          error.response?.data?.message || "Failed to load subscription plans.",
          { position: "top-center" }
        );
        setPlans([
          {
            title: "Free",
            price: 0,
            note: "NGN/Month",
            description: "Unable to load plans.",
            current: true,
            popular: false,
            features: ["Please try again later."],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!cardNumber.match(/^\d{16}$/)) {
      errors.cardNumber = "Card number must be 16 digits.";
    }
    if (!expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      errors.expiry = "Expiry must be in MM/YY format.";
    }
    if (!cvv.match(/^\d{3}$/)) {
      errors.cvv = "CVV must be 3 digits.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the form errors.", { position: "top-center" });
      return;
    }

    try {
      await axiosInstance.post("/subscribe", {
        planTitle: plans[index].title,
        cardNumber,
        expiry,
        cvv,
      });
      toast.success("Subscription successful!", { position: "top-center" });
      setShowPaymentForm(false);
      setCardNumber("");
      setExpiry("");
      setCvv("");
      // Refresh plans to update current plan
      const { data } = await axiosInstance.get("/plans");
      setPlans(data.length ? data : plans);
    } catch (error) {
      console.error("Error processing subscription:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(
        error.response?.data?.message || "Failed to process subscription.",
        { position: "top-center" }
      );
    }
  };

  const handleNext = () => {
    if (index < plans.length - 1) setIndex(index + 1);
  };

  const handleBack = () => {
    if (index > 0) setIndex(index - 1);
  };

  const togglePlans = () => setShowPlans(!showPlans);
  const closePlans = () => setShowPlans(false);
  const showPayment = () => setShowPaymentForm(true);
  const closePayment = () => {
    setShowPaymentForm(false);
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setFormErrors({});
  };

  const formatPrice = (price) =>
    `₦${Number(price).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
    })}`;

  const plan = plans[index] || {};

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-2xl rounded-2xl p-4 sm:p-8 mb-10 border border-blue-700 w-full">
      <ToastContainer />
      <div className="flex items-center mb-6">
        <FaChartLine className="text-blue-400 mr-4" size={28} />
        <h2 className="text-2xl font-bold text-white">Subscription Plans</h2>
      </div>

      <p className="text-gray-300 mb-6">
        Choose the plan that fits your goals and unlock premium features.
      </p>

      {loading ? (
        <div className="text-center py-6">
          <svg
            className="animate-spin h-8 w-8 text-white mx-auto"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      ) : !showPlans ? (
        <button
          onClick={togglePlans}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl font-semibold transition w-full sm:w-auto"
        >
          View Plans
        </button>
      ) : (
        <div className="w-full">
          <div
            className={`rounded-2xl p-6 sm:p-8 transition-all ${
              plan.popular ? "bg-blue-700" : "bg-gray-800"
            }`}
          >
            {plan.popular && (
              <div className="text-white text-xs font-bold tracking-widest mb-3">
                MOST POPULAR
              </div>
            )}
            <h2 className="text-3xl font-bold text-white mb-2">{plan.title}</h2>
            <p className="text-2xl text-white mb-1">{formatPrice(plan.price)}</p>
            <p className="text-sm text-gray-300 mb-6">{plan.note}</p>

            <p className="text-gray-400 mb-6">{plan.description}</p>

            <ul className="space-y-3 mb-8">
              {plan.features?.map((feature, idx) => (
                <li key={idx} className="flex items-center text-gray-200">
                  <span className="text-green-400 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={showPayment}
              disabled={plan.current}
              className={`w-full p-3 rounded-xl font-bold text-white transition ${
                plan.current
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {plan.current ? "Current Plan" : "Subscribe"}
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[999] px-4">
          <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-white mb-6">
              Payment Details
            </h3>
            <form className="space-y-4" onSubmit={handlePaymentSubmit}>
              <div>
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className={`w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none ${
                    formErrors.cardNumber ? "border-red-500 border" : ""
                  }`}
                />
                {formErrors.cardNumber && (
                  <p className="text-red-400 text-xs mt-1">
                    {formErrors.cardNumber}
                  </p>
                )}
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className={`w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none ${
                      formErrors.expiry ? "border-red-500 border" : ""
                    }`}
                  />
                  {formErrors.expiry && (
                    <p className="text-red-400 text-xs mt-1">
                      {formErrors.expiry}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className={`w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none ${
                      formErrors.cvv ? "border-red-500 border" : ""
                    }`}
                  />
                  {formErrors.cvv && (
                    <p className="text-red-400 text-xs mt-1">{formErrors.cvv}</p>
                  )}
                </div>
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
}