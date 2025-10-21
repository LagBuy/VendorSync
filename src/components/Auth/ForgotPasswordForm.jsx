import { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";

const ForgotPasswordForm = ({ onSwitch }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axiosInstance.post("/auth/password/reset/", {
        email,
      });
      toast.success(data.message || "Reset link sent to your email!");
      setEmail(""); // Clear input
    } catch (e) {
      const message =
        e.response?.data?.message ||
        "Failed to send reset link. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-md mx-auto p-8 rounded-2xl shadow-xl backdrop-blur-sm"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        border: "2px solid rgba(252, 230, 0, 1)",
        backgroundImage:
          "linear-gradient(135deg, rgba(252, 230, 0, 0.05) 0%, rgba(165, 244, 213, 0.05) 100%)",
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "rgba(252, 230, 0, 0.2)",
            border: "2px solid rgba(252, 230, 0, 1)",
          }}
        >
          <span className="text-2xl">🔓</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-900 to-black bg-clip-text text-transparent">
          Reset Password
        </h2>
        <p className="text-sm mt-2" style={{ color: "rgba(17, 36, 29, 0.7)" }}>
          Enter your valid email to receive a reset link
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mb-6 p-3 rounded-lg text-center text-sm font-medium"
          style={{
            backgroundColor: "rgba(255, 249, 183, 0.3)",
            border: "1px solid rgba(252, 230, 0, 0.5)",
            color: "rgba(17, 36, 29, 1)",
          }}
        >
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleReset} className="space-y-6">
        <div>
          <label
            className="block mb-3 text-sm font-semibold"
            style={{ color: "rgba(17, 36, 29, 1)" }}
          >
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 placeholder-opacity-60"
            style={{
              borderColor: "rgba(165, 244, 213, 1)",
              backgroundColor: "rgba(255, 255, 255, 1)",
              color: "rgba(17, 36, 29, 1)",
              focusRingColor: "rgba(252, 230, 0, 0.3)",
            }}
            placeholder="Enter your email address"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 px-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          style={{
            backgroundColor: "rgba(26, 54, 43, 1)",
            backgroundImage:
              "linear-gradient(135deg, rgba(26, 54, 43, 1) 0%, rgba(17, 36, 29, 1) 100%)",
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending Reset Link...</span>
            </div>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>

      {/* Footer */}
      <div
        className="text-center mt-8 pt-6 border-t"
        style={{ borderColor: "rgba(165, 244, 213, 0.5)" }}
      >
        <p className="text-sm" style={{ color: "rgba(17, 36, 29, 0.7)" }}>
          Remembered your password?{" "}
          <button
            onClick={() => onSwitch("login")}
            className="font-bold hover:underline transition-all duration-200"
            style={{ color: "rgba(26, 54, 43, 1)" }}
            disabled={isLoading}
          >
            Back to Login
          </button>
        </p>
      </div>

      {/* Decorative Elements */}
      <div
        className="absolute top-0 left-0 w-20 h-20 -translate-x-6 -translate-y-6 rounded-full opacity-10"
        style={{ backgroundColor: "rgba(252, 230, 0, 1)" }}
      ></div>
      <div
        className="absolute bottom-0 right-0 w-16 h-16 translate-x-4 translate-y-4 rounded-full opacity-10"
        style={{ backgroundColor: "rgba(165, 244, 213, 1)" }}
      ></div>
    </div>
  );
};

export default ForgotPasswordForm;
