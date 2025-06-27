import { useEffect } from "react";

const EmailVerification = ({ onSwitch, email = "" }) => {
  useEffect(() => {
    console.log("EmailVerification mounted with props:", { email, onSwitch });
  }, [email, onSwitch]);

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg text-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center">Email Verified!</h2>
        <div className="text-center space-y-4">
          <p className="text-lg">
            Your email{" "}
            <span className="font-semibold">{email || "N/A"}</span> has been
            successfully verified!
          </p>
          <button
            onClick={() => {
              console.log("Proceed button clicked, switching to signup with email:", email);
              onSwitch("signup", { email });
            }}
            className="w-full bg-blue-200 hover:bg-blue-rose-500 text-red font-bold py-2 px-4 rounded-md transition duration-200"
          >
            Proceed to Sign Up
          </button>
        </div>
        <div className="text-sm mt-4 text-center text-gray-200">
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