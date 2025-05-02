import { useState } from "react";
import TermsAndConditions from "./TermsAndConditions";
import { FaRegHandshake } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TermsModalTrigger = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = () => {
    toast.success("✅ Terms accepted and submitted!", {
      position: "top-center",
      autoClose: 3000,
    });

    // Auto-close dropdown and reset checkbox
    setShowTerms(false);
    setAgreed(false);
  };

  return (
    <div className="bg-white-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-blue-700 mb-8">
      <ToastContainer />

      <h2 className="text-xl font-bold mb-6 flex items-center text-center">
        <FaRegHandshake className="text-white-100 mr-3" size={24} />
        T&apos;s And C&apos;s
      </h2>
      <p className="my-3">
        kindly go through our term's and conditions and get clarity.
      </p>
      <div className="text-left">
        <button
          onClick={() => setShowTerms(!showTerms)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          {showTerms ? "Hide Me." : "Read Me."}
        </button>
      </div>

      {showTerms && (
        <div className="mt-4 border border-gray-300 rounded-lg bg-white max-h-[300px] overflow-y-auto shadow-inner">
          <TermsAndConditions />
        </div>
      )}

      {showTerms && (
        <>
          <div className="mt-4 flex items-start">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mr-2 mt-1"
            />
            <label htmlFor="agree" className="text-sm text-gray-100">
              I agree to the Terms and Conditions
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!agreed}
            className={`mt-4 w-50 py-2 px-4 rounded font-bold text-white ${
              agreed
                ? "bg-blue-700 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
};

export default TermsModalTrigger;
