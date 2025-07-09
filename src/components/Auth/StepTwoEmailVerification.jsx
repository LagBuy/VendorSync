import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../axios-instance/axios-instance";

const EmailVerification = ({ onSwitch, email = "" }) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (token) {
        try {
          await axiosInstance.get(`/auth/signup/verify-email/?token=${token}`);
          toast.success(`Email ${email || "N/A"} verified successfully!`);
        } catch (e) {
          console.error("Email Verification Error:", e.response?.data, e.message);
          toast.error(
            e.response?.data?.message || "Email verification failed."
          );
        }
      } else {
        toast.success(`Verification email sent to ${email || "N/A"}. Please check your inbox.`);
      }
    };
    verifyEmail();
  }, [email, token]);

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {token ? "Email Verified!" : "Check Your Email"}
        </h2>
        <div className="text-center space-y-4">
          <p className="text-lg">
            {token
              ? `Your email ${email || ""} has been successfully verified!`
              : `A verification email has been sent to ${email || ""}. Please check your inbox and follow the instructions.`}
          </p>
          <button
            onClick={() => {
              console.log("Proceed button clicked, switching to login");
              onSwitch("login");
            }}
            className="w-full bg-blue-500 hover:bg-blue-rose-500 text-white font-bold py-2 px-4 rounded-md transition duration-200"
          >
            Proceed to Log In
          </button>
        </div>
        <div className="text-sm mt-4 text-center text-gray-600">
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                console.log("Login button clicked");
                onSwitch("login");
              }}
              className="text-blue-500 hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;