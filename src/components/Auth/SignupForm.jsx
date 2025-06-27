import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Cookies from "js-cookie";
import { axiosInstance } from "../../axios-instance/axios-instance";

const SignupForm = ({ onSwitch, onLogin, email: initialEmail = "" }) => {
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const SIGNUP_ENDPOINT = "/auth/signup/";

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

    const namePattern = /^[A-Za-z]+$/;
    if (
      !firstName ||
      !lastName ||
      !namePattern.test(firstName) ||
      !namePattern.test(lastName)
    ) {
      setError("First and Last names must contain only letters.");
      setIsLoading(false);
      return;
    }
    if (
      firstName[0] !== firstName[0].toUpperCase() ||
      lastName[0] !== lastName[0].toUpperCase()
    ) {
      setError("Names must start with a capital letter.");
      setIsLoading(false);
      return;
    }
    const dobPattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dob || !dobPattern.test(dob)) {
      setError("Date of Birth must be in dd/mm/yyyy format.");
      setIsLoading(false);
      return;
    }
    const phonePattern = /^(07|08|09)\d{9}$/;
    if (!phonePattern.test(phone)) {
      setError("Phone must be 11 digits and start with 07, 08, or 09.");
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
        first_name: firstName,
        last_name: lastName,
        gender,
        address,
        dob,
        phone_number: phone,
        password1: password,
        business_type: businessType === "Other" ? customBusinessType : businessType,
        depends_on_dollar_rate: dependsOnDollarRate === "Yes",
      };
      const response = await axiosInstance.post(SIGNUP_ENDPOINT, reqBody);
      console.log("Signup Response:", response.data);
      const { user, access } = response.data;
      Cookies.set("jwt-token", access, { expires: 1 });
      onLogin(user, access);
      onSwitch("login"); // Switch to login form after successful signup
    } catch (e) {
      console.error("Signup Error:", e.response?.data, e.message);
      setError(e.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    if (step > 3) setStep(step - 1);
    else if (step === 3) setStep(1);
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
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-rose-500 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Skip & Continue"}
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
            <label className="block mb-1 text-sm font-medium">
              Date of Birth
            </label>
            <input
              type="text"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-rose-400"
              placeholder="dd/mm/yyyy"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setError("");
              const namePattern = /^[A-Za-z]+$/;
              if (
                !firstName ||
                !lastName ||
                !namePattern.test(firstName) ||
                !namePattern.test(lastName)
              ) {
                setError("First and Last names must contain only letters.");
                return;
              }
              if (
                firstName[0] !== firstName[0].toUpperCase() ||
                lastName[0] !== lastName[0].toUpperCase()
              ) {
                setError("Names must start with a capital letter.");
                return;
              }
              const dobPattern =
                /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
              if (!dob || !dobPattern.test(dob)) {
                setError("Date of Birth must be in dd/mm/yyyy format.");
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
            <label className="block mb-1 text-sm font-medium">
              Business Type
            </label>
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
              <label className="block mb-1 text-sm font-medium">
                Custom Business Type
              </label>
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
            <label className="block mb-1 text-sm font-medium">
              Depends on Dollar Rate?
            </label>
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
            <label className="block mb-1 text-sm font-medium">
              Confirm Password
            </label>
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
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
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
    </div>
  );
};

export default SignupForm;