import { useState } from "react";

const ForgotPasswordForm = ({ onSwitch }) => {
  const [email, setEmail] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    alert(`Reset link sent to ${email}`);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Reset Password 🔓</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Send Reset Link
        </button>
      </form>
      <div className="text-sm mt-4 text-center">
        <p>
          Remembered your password?{" "}
          <button
            onClick={() => onSwitch("login")}
            className="text-blue-600 underline"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
