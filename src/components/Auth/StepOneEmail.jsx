import { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";

const StepOneEmail = ({ email, setEmail, handleProceed, onSwitch }) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateAndProceed = async () => {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.(com|net|org)$/i;

    if (!emailPattern.test(email)) {
      setError("Email must end with .com, .net, or .org");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      console.log("Sending verification email request for:", email);
      await axiosInstance.post("/auth/signup/verify-email/", {
        key: email,
      });
      console.log("Verification email sent successfully");
      toast.success(
        `Verification email sent to ${email}. Please check your inbox.`,
        {
          className: "custom-toast-success",
        }
      );
      handleProceed();
    } catch (error) {
      console.error("Error sending verification email:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      if (
        error.response?.data?.message?.includes("already exists") ||
        error.response?.data?.email?.includes("already exists")
      ) {
        setError(
          "This email is already registered. Please use a different email or log in."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to send verification email. Please try again."
        );
      }
      toast.error(
        error.response?.data?.message || "Failed to send verification email.",
        {
          className: "custom-toast-error",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <label className="block mb-1 text-sm font-medium text-[#FFF9B0]">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md bg-[#1A362B] text-[#FFF9B0] border-[#FFF9B0]"
          placeholder="example@email.com"
          disabled={isLoading}
        />
        {error && <p className="text-[#D32F2F] text-sm mt-1">{error}</p>}
      </div>

      <button
        onClick={validateAndProceed}
        type="button"
        className="w-full bg-[#2E7D32] text-[#fff371] py-2 rounded-md mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Proceed"}
      </button>

      <p className="text-center mt-4 text-sm text-[#FFF9B0]">
        Already have an account?{" "}
        <button
          onClick={() => onSwitch("login")}
          className="text-[#2E7D32] hover:underline"
          disabled={isLoading}
        >
          Back to Login
        </button>
      </p>
    </>
  );
};

export default StepOneEmail;
