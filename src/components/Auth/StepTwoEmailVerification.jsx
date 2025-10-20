import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../axios-instance/axios-instance";

const EmailVerification = ({ onSwitch, email = "", handleProceed }) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (token) {
        setIsLoading(true);
        try {
          console.log("Verifying email with token:", token);
          await axiosInstance.get(
            `/auth/signup/verify-email/?token=${token}`
          );
          console.log("Email verification successful");
          toast.success(`Email ${email || "N/A"} verified successfully!`, {
            className: "custom-toast-success",
          });
          handleProceed(); // Move to step 3
        } catch (e) {
          console.error("Email Verification Error:", {
            status: e.response?.status,
            data: e.response?.data,
            message: e.message,
          });
          setError(e.response?.data?.message || "Email verification failed.");
          toast.error(
            e.response?.data?.message || "Email verification failed.",
            {
              className: "custom-toast-error",
            }
          );
        } finally {
          setIsLoading(false);
        }
      }
    };
    verifyEmail();
  }, [email, token, handleProceed]);

  const handleResendEmail = async () => {
    setIsLoading(true);
    setError("");
    try {
      console.log("Resending verification email to:", email);
      await axiosInstance.post("/auth/signup/verify-email/", {
        key: email,
      });
      console.log("Verification email resent successfully");
      toast.success(
        `Verification email resent to ${email}. Please check your inbox.`,
        {
          className: "custom-toast-success",
        }
      );
    } catch (e) {
      console.error("Error resending verification email:", {
        status: e.response?.status,
        data: e.response?.data,
        message: e.message,
      });
      setError(
        e.response?.data?.message || "Failed to resend verification email."
      );
      toast.error(
        e.response?.data?.message || "Failed to resend verification email.",
        {
          className: "custom-toast-error",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-md mx-auto p-8 rounded-lg shadow-lg"
      style={{
        backgroundColor: "rgba(255, 255, 255, 1)",
        border: "2px solid rgba(252, 230, 0, 1)",
      }}
    >
      <h2
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: "rgba(17, 36, 29, 1)" }}
      >
        {token ? "Email Verification" : "Check Your Email"}
      </h2>
      <div className="text-center space-y-4">
        <p className="text-lg" style={{ color: "rgba(17, 36, 29, 0.8)" }}>
          {token
            ? `Verifying your email ${email || ""}...`
            : `A verification email has been sent to ${
                email || ""
              }. Please check your inbox (and spam/junk folder) and click the verification link to continue.`}
        </p>
        {error && <p className="text-[#D32F2F] text-sm">{error}</p>}
        {!token && (
          <button
            onClick={handleResendEmail}
            className="w-full bg-[#2E7D32] text-[#fff371] font-bold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Resending..." : "Resend Verification Email"}
          </button>
        )}
        <button
          onClick={() => {
            console.log("Proceed to login clicked");
            onSwitch("login");
          }}
          className="w-full bg-[#1A362B] text-[#FFF9B0] font-bold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          Proceed to Log In
        </button>
      </div>
      <div
        className="text-sm mt-4 text-center"
        style={{ color: "rgba(17, 36, 29, 0.8)" }}
      >
        <p>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => {
              console.log("Login button clicked");
              onSwitch("login");
            }}
            className="text-[#2E7D32] hover:underline"
            disabled={isLoading}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;
