import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { toast } from "react-toastify";
const SignupForm = ({ onSwitch, email: initialEmail = "" }) => {
  const [step, setStep] = useState(initialEmail ? 3 : 1);
  const [email, setEmail] = useState(initialEmail);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [customBusinessType, setCustomBusinessType] = useState("");
  const [dependsOnDollarRate, setDependsOnDollarRate] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessLocationCity, setBusinessLocationCity] = useState("");
  const [businessLocationState, setBusinessLocationState] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDuplicateEmailModal, setShowDuplicateEmailModal] = useState(false);

  const SIGNUP_ENDPOINT = "/auth/signup/";
  const VERIFY_EMAIL_ENDPOINT = "/auth/signup/verify-email/";

  const handleSkipEmailVerification = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setStep(3);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedBusinessName = businessName.trim();
    const trimmedBusinessLocationCity = businessLocationCity.trim();
    const trimmedBusinessLocationState = businessLocationState.trim();
    const namePattern = /^[A-Za-z\s]+$/;
    if (
      !trimmedFirstName ||
      !trimmedLastName ||
      !namePattern.test(trimmedFirstName) ||
      !namePattern.test(trimmedLastName)
    ) {
      setError("First and Last names must contain only letters and spaces.");
      setIsLoading(false);
      return;
    }
    if (
      !/[A-Za-z]/.test(trimmedFirstName[0]) ||
      !/[A-Za-z]/.test(trimmedLastName[0])
    ) {
      setError("Names must start with a letter.");
      setIsLoading(false);
      return;
    }
    const dobPattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!dob || !dobPattern.test(dob)) {
      setError("Date of Birth must be a valid date in YYYY-MM-DD format.");
      setIsLoading(false);
      return;
    }
    const phonePattern = /^(07|08|09)\d{9}$/;
    if (!phonePattern.test(phone)) {
      setError("Phone must be 11 digits and start with 07, 08, or 09.");
      setIsLoading(false);
      return;
    }
    if (!trimmedBusinessName || !namePattern.test(trimmedBusinessName)) {
      setError("Business name must contain only letters and spaces.");
      setIsLoading(false);
      return;
    }
    if (!/[A-Za-z]/.test(trimmedBusinessName[0])) {
      setError("Business name must start with a letter.");
      setIsLoading(false);
      return;
    }
    if (!trimmedBusinessLocationCity || !namePattern.test(trimmedBusinessLocationCity)) {
      setError("Business city must contain only letters and spaces.");
      setIsLoading(false);
      return;
    }
    if (!/[A-Za-z]/.test(trimmedBusinessLocationCity[0])) {
      setError("Business city must start with a letter.");
      setIsLoading(false);
      return;
    }
    if (!trimmedBusinessLocationState || !namePattern.test(trimmedBusinessLocationState)) {
      setError("Business state must contain only letters and spaces.");
      setIsLoading(false);
      return;
    }
    if (!/[A-Za-z]/.test(trimmedBusinessLocationState[0])) {
      setError("Business state must start with a letter.");
      setIsLoading(false);
      return;
    }
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordPattern.test(password)) {
      setError(
        "Password must be strong (8+ chars, 1 capital, 1 number, 1 special char)."
      );
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    if (!dependsOnDollarRate) {
      setError("Please select if your business depends on Dollar rate.");
      setIsLoading(false);
      return;
    }

    try {
      const reqBody = {
        email,
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        gender,
        address,
        dob,
        phone_number: phone,
        password1: password,
        roles: ["vendor"], // Stringified to match potential backend expectation
        business_type: businessType === "Other" ? customBusinessType : businessType,
        depends_on_dollar_rate: dependsOnDollarRate === "Yes",
        business_name: trimmedBusinessName,
        business_location_city: trimmedBusinessLocationCity,
        business_location_state: trimmedBusinessLocationState,
      };

      console.log("Signup Request Body:", reqBody);

      const signupResponse = await axiosInstance.post(SIGNUP_ENDPOINT, reqBody);
      console.log("Signup Response:", signupResponse.data, "Roles assigned:", signupResponse.data.roles || "Not returned");

      toast.success("Vendor account created successfully! Sending verification email...");

      // Request verification email
      try {
        await axiosInstance.post(VERIFY_EMAIL_ENDPOINT, { key: email });
        toast.success(`Verification email sent to ${email}. Please check your inbox.`);
      } catch (verifyError) {
        console.error("Verification Email Error:", verifyError.response?.data, verifyError.message);
        toast.error(
          verifyError.response?.data?.message ||
            "Failed to send verification email. Please try again or contact support."
        );
      }

      setShowSuccessModal(true);
    } catch (e) {
      console.error("Signup Error:", e.response?.data, e.message);
      if (
        e.response?.data?.message?.includes("email already exists") ||
        e.response?.data?.detail?.includes("email already exists") ||
        e.response?.data?.email?.includes("already exists")
      ) {
        setShowDuplicateEmailModal(true);
      } else {
        setError(e.response?.data?.message || "Signup failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    if (step > 3) setStep(step - 1);
    else if (step === 3) setStep(1);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onSwitch("login"); // Redirect to login page after successful signup
  };

  const handleCloseDuplicateEmailModal = () => {
    setShowDuplicateEmailModal(false);
    setEmail(""); // Clear email field to encourage a new email
    setStep(1); // Return to email input step
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account 👤</h2>
      {error && (
        <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
      )}
      {step === 1 && (
        <form onSubmit={handleSkipEmailVerification} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
              placeholder="Enter your valid email"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-rose-500 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Continue"}
          </button>
          <div className="text-sm mt-4 text-center text-gray-600">
            <p>
              Already have an account?
              <button
                onClick={() => onSwitch("login")}
                className="text-blue-500 hover:underline"
              >
                Log in
              </button>
            </p>
          </div>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">First Name</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Last Name</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
              placeholder="Enter your last name"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
              placeholder="Enter your address"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setError("");
              const trimmedFirstName = firstName.trim();
              const trimmedLastName = lastName.trim();
              const namePattern = /^[A-Za-z\s]+$/;
              const dobPattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
              if (
                !trimmedFirstName ||
                !trimmedLastName ||
                !namePattern.test(trimmedFirstName) ||
                !namePattern.test(trimmedLastName)
              ) {
                setError("First and Last names must contain only letters and spaces.");
                return;
              }
              if (
                !/[A-Za-z]/.test(trimmedFirstName[0]) ||
                !/[A-Za-z]/.test(trimmedLastName[0])
              ) {
                setError("Names must start with a letter.");
                return;
              }
              if (!dob || !dobPattern.test(dob)) {
                setError("Date of Birth must be a valid date in YYYY-MM-DD format.");
                return;
              }
              setStep(4);
            }}
            className="w-full bg-blue-500 hover:bg-blue-rose-500 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Continue"}
          </button>
          <div className="text-sm mt-4 text-center text-gray-600">
            <p>
              <button
                onClick={handleBack}
                className="text-blue-500 hover:underline"
                disabled={isLoading}
              >
                Back
              </button>
            </p>
          </div>
        </form>
      )}
      {step === 4 && (
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Business Name</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
              placeholder="Enter your business name"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Business Location City</label>
            <input
              type="text"
              required
              value={businessLocationCity}
              onChange={(e) => setBusinessLocationCity(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
              placeholder="Enter your business city"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Business Location State</label>
            <input
              type="text"
              required
              value={businessLocationState}
              onChange={(e) => setBusinessLocationState(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
              placeholder="Enter your business state"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Business Type</label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
            >
              <option value="">Select Business Type</option>
              <option value="Retail">Retail</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Service">Service</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {businessType === "Other" && (
            <div>
              <label className="block mb-1 text-sm font-medium">Custom Business Type</label>
              <input
                type="text"
                required
                value={customBusinessType}
                onChange={(e) => setCustomBusinessType(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
                placeholder="Enter your business type"
              />
            </div>
          )}
          <div>
            <label className="block mb-1 text-sm font-medium">Depends on Dollar Rate?</label>
            <select
              value={dependsOnDollarRate}
              onChange={(e) => setDependsOnDollarRate(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
            >
              <option value="">Select Option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Phone</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
                placeholder="Enter your password"
              />
              <span
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
                placeholder="Confirm your password"
              />
              <span
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
              >
                {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-rose-500 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
          <div className="text-sm mt-4 text-center text-gray-600">
            <p>
              <button
                onClick={handleBack}
                className="text-blue-500 hover:underline"
                disabled={isLoading}
              >
                Back
              </button>
            </p>
          </div>
        </form>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold text-center mb-4">Congratulations!</h3>
            <p className="text-center mb-4">
              Your vendor account has been created successfully. A verification email has been sent to {email}. Please check your inbox (and spam/junk folder) and click the verification link to activate your vendor status and add products. If you need assistance, contact{" "}
              <a
                href="mailto:support@lagbuy.com"
                className="text-blue-500 hover:underline"
              >
                support@lagbuy.com
              </a>.
            </p>
            <div className="text-center">
              <button
                onClick={handleCloseSuccessModal}
                className="bg-blue-500 hover:bg-blue-rose-500 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showDuplicateEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold text-center mb-4">Email Already Exists</h3>
            <p className="text-center mb-4">
              The email you entered already exists. Do you have an alternative email?
            </p>
            <div className="text-center space-x-4">
              <button
                onClick={handleCloseDuplicateEmailModal}
                className="bg-blue-500 hover:bg-blue-rose-500 text-white font-bold py-2 px-4 rounded"
              >
                Try Another Email
              </button>
              <button
                onClick={() => {
                  setShowDuplicateEmailModal(false);
                  onSwitch("login");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupForm;


