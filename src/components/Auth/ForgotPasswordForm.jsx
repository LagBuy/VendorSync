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
      const { data } = await axiosInstance.post("/auth/password/reset/", { email });
      toast.success(data.message || "Reset link sent to your email!");
      setEmail(""); // Clear input
    } catch (e) {
      const message = e.response?.data?.message || "Failed to send reset link. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Reset Password 🔓</h2>
      {error && (
        <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
      )}
      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
            placeholder="example@email.com"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-rose-500 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      <div className="text-sm mt-4 text-center text-gray-600">
        <p>
          Remembered your password?{" "}
          <button
            onClick={() => onSwitch("login")}
            className="text-blue-500 hover:underline"
            disabled={isLoading}
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;