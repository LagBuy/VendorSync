import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../axios-instance/axios-instance";
import {
  FaEnvelope,
  FaCheckCircle,
  FaRedo,
  FaArrowRight,
} from "react-icons/fa";

const EmailVerification = ({ onSwitch, email = "", handleProceed }) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (token) {
        setIsLoading(true);
        try {
          console.log("Verifying email with token:", token);
          await axiosInstance.get(`/auth/signup/verify-email/?token=${token}`);
          console.log("Email verification successful");
          setIsVerified(true);
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
      className="w-full max-w-md mx-auto p-8 rounded-2xl shadow-xl backdrop-blur-sm relative overflow-hidden"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        border: "2px solid rgba(252, 230, 0, 1)",
        backgroundImage:
          "linear-gradient(135deg, rgba(252, 230, 0, 0.05) 0%, rgba(165, 244, 213, 0.05) 100%)",
      }}
    >
      {/* Decorative Background Elements */}
      <div
        className="absolute top-0 right-0 w-28 h-28 -translate-y-14 translate-x-14 rounded-full opacity-10"
        style={{ backgroundColor: "rgba(252, 230, 0, 1)" }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-20 h-20 -translate-x-10 translate-y-10 rounded-full opacity-10"
        style={{ backgroundColor: "rgba(165, 244, 213, 1)" }}
      ></div>

      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <div
          className={`w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
            isVerified ? "scale-110" : ""
          }`}
          style={{
            backgroundColor: isVerified
              ? "rgba(165, 244, 213, 0.2)"
              : "rgba(252, 230, 0, 0.15)",
            border: `2px solid ${
              isVerified ? "rgba(165, 244, 213, 0.8)" : "rgba(252, 230, 0, 0.5)"
            }`,
          }}
        >
          {isVerified ? (
            <FaCheckCircle
              className="text-4xl"
              style={{ color: "rgba(26, 54, 43, 1)" }}
            />
          ) : (
            <FaEnvelope
              className="text-4xl"
              style={{ color: "rgba(26, 54, 43, 1)" }}
            />
          )}
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-900 to-black bg-clip-text text-transparent mb-2">
          {token
            ? isVerified
              ? "Email Verified!"
              : "Verifying Email"
            : "Check Your Email"}
        </h2>
        <p className="text-sm mt-2" style={{ color: "rgba(17, 36, 29, 0.7)" }}>
          {token
            ? isVerified
              ? "Your email has been successfully verified!"
              : `Verifying ${email || "your email"}...`
            : "We've sent a verification link to your email"}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mb-6 p-4 rounded-xl text-center text-sm font-medium relative z-10"
          style={{
            backgroundColor: "rgba(255, 249, 183, 0.3)",
            border: "1px solid rgba(252, 230, 0, 0.5)",
            color: "rgba(17, 36, 29, 1)",
          }}
        >
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="text-center space-y-6 relative z-10">
        <div
          className="p-4 rounded-xl"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            border: "1px solid rgba(165, 244, 213, 0.5)",
          }}
        >
          <p
            className="text-lg leading-relaxed"
            style={{ color: "rgba(17, 36, 29, 0.9)" }}
          >
            {token
              ? `We're verifying your email address ${
                  email ? `(${email})` : ""
                }. Please wait a moment...`
              : `A verification email has been sent to ${
                  email || "your email address"
                }. Please check your inbox (and spam/junk folder) and click the verification link to continue.`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {!token && (
            <button
              onClick={handleResendEmail}
              className="w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 group"
              style={{
                backgroundColor: "rgba(252, 230, 0, 0.1)",
                border: "2px solid rgba(252, 230, 0, 1)",
                color: "rgba(17, 36, 29, 1)",
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Resending...</span>
                </>
              ) : (
                <>
                  <FaRedo className="group-hover:rotate-180 transition-transform duration-500" />
                  <span>Resend Verification Email</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => {
              console.log("Proceed to login clicked");
              onSwitch("login");
            }}
            className="w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 group"
            style={{
              backgroundColor: "rgba(26, 54, 43, 1)",
              backgroundImage:
                "linear-gradient(135deg, rgba(26, 54, 43, 1) 0%, rgba(17, 36, 29, 1) 100%)",
            }}
            disabled={isLoading}
          >
            <span>Proceed to Log In</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        className="text-center mt-8 pt-6 border-t relative z-10"
        style={{ borderColor: "rgba(165, 244, 213, 0.5)" }}
      >
        <p className="text-sm" style={{ color: "rgba(17, 36, 29, 0.7)" }}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => {
              console.log("Login button clicked");
              onSwitch("login");
            }}
            className="font-bold hover:underline transition-all duration-200 hover:scale-105"
            style={{ color: "rgba(26, 54, 43, 1)" }}
            disabled={isLoading}
          >
            Log in
          </button>
        </p>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 rounded-2xl flex items-center justify-center z-20">
          <div className="text-center">
            <div
              className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
              style={{
                borderColor: "rgba(26, 54, 43, 1)",
                borderTopColor: "transparent",
              }}
            ></div>
            <p style={{ color: "rgba(17, 36, 29, 1)" }}>Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
