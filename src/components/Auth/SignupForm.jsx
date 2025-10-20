import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { toast } from "react-toastify";

const SignupForm = ({ onSwitch, email: initialEmail = "" }) => {
  const [step, setStep] = useState(initialEmail ? 3 : 1);
  const [formData, setFormData] = useState({
    email: initialEmail,
    firstName: "",
    lastName: "",
    gender: "",
    address: "",
    dob: "1990-01-01", // Default to older date to avoid age issues
    phone: "",
    businessName: "",
    businessLocationCity: "",
    businessLocationState: "",
    userCity: "",
    userState: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDuplicateEmailModal, setShowDuplicateEmailModal] = useState(false);

  const SIGNUP_ENDPOINT = "/auth/signup/";
  const VERIFY_EMAIL_ENDPOINT = "/auth/signup/verify-email/";

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateEmail = (email) => {
    return !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateName = (name) => {
    const namePattern = /^[A-Za-z\s]+$/;
    return !name || !namePattern.test(name.trim()) || !/[A-Za-z]/.test(name.trim()[0]);
  };

  const validatePhone = (phone) => {
    const phonePattern = /^0(7|8|9)\d{9}$/;
    return !phonePattern.test(phone);
  };

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return !passwordPattern.test(password);
  };

  const validateStep3 = () => {
    const { firstName, lastName, userCity, userState, dob, phone } = formData;

    if (validateName(firstName)) {
      setError("First name must contain only letters and spaces, and start with a letter.");
      return false;
    }

    if (validateName(lastName)) {
      setError("Last name must contain only letters and spaces, and start with a letter.");
      return false;
    }

    if (validateName(userCity)) {
      setError("Your city must contain only letters and spaces, and start with a letter.");
      return false;
    }

    if (validateName(userState)) {
      setError("Your state must contain only letters and spaces, and start with a letter.");
      return false;
    }

    const dobPattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!dob || !dobPattern.test(dob)) {
      setError("Date of Birth must be a valid date in YYYY-MM-DD format.");
      return false;
    }

    // Ensure DOB results in age >= 18
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age;
    }
    if (age < 18) {
      setError("You must be at least 18 years old.");
      return false;
    }

    if (validatePhone(phone)) {
      setError("Phone must be 11 digits, start with 07, 08, or 09 (e.g., 08012345678).");
      return false;
    }

    return true;
  };

  const validateStep4 = () => {
    const { businessName, businessLocationCity, businessLocationState, password, confirmPassword } = formData;

    if (validateName(businessName)) {
      setError("Business name must contain only letters and spaces, and start with a letter.");
      return false;
    }

    if (validateName(businessLocationCity)) {
      setError("Business city must contain only letters and spaces, and start with a letter.");
      return false;
    }

    if (validateName(businessLocationState)) {
      setError("Business state must contain only letters and spaces, and start with a letter.");
      return false;
    }

    if (validatePassword(password)) {
      setError("Password must be strong (8+ chars, 1 capital, 1 number, 1 special char).");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSkipEmailVerification = (e) => {
    e.preventDefault();
    setError("");
    
    if (validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    setStep(3);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!validateStep4()) {
      setIsLoading(false);
      return;
    }

    try {
      const reqBody = {
        email: formData.email.trim(),
        password1: formData.password,
        password2: formData.confirmPassword, // Added to match Postman
        roles: ["user", "vendor"],
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone_number: formData.phone,
        address: formData.address.trim(),
        gender: formData.gender,
        dob: formData.dob,
        state: formData.userState.trim(),
        city: formData.userCity.trim(),
        business_name: formData.businessName.trim(),
        business_location_city: formData.businessLocationCity.trim(),
        business_location_state: formData.businessLocationState.trim(),
      };

      console.log("Signup Request Body:", reqBody);

      const signupResponse = await axiosInstance.post(SIGNUP_ENDPOINT, reqBody);
      console.log("Signup Response:", signupResponse.data);

      toast.success("Vendor account created successfully! Sending verification email...");

      // Request verification email
      try {
        await axiosInstance.post(VERIFY_EMAIL_ENDPOINT, { key: formData.email });
        toast.success(`Verification email sent to ${formData.email}. Please check your inbox.`);
      } catch (verifyError) {
        console.error("Verification Email Error:", verifyError);
        toast.error(
          verifyError.response?.data?.message ||
            "Failed to send verification email. Please try again or contact support."
        );
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Signup Error:", error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.email) {
          setError(`Email error: ${Array.isArray(errorData.email) ? errorData.email[0] : errorData.email}`);
        } else if (errorData.business_name) {
          setError(`Business name error: ${Array.isArray(errorData.business_name) ? errorData.business_name[0] : errorData.business_name}`);
        } else if (errorData.phone_number) {
          setError(`Phone number error: ${Array.isArray(errorData.phone_number) ? errorData.phone_number[0] : errorData.phone_number}`);
        } else if (errorData.password1) {
          setError(`Password error: ${Array.isArray(errorData.password1) ? errorData.password1[0] : errorData.password1}`);
        } else if (errorData.non_field_errors) {
          setError(`Error: ${Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : errorData.non_field_errors}`);
        } else if (
          errorData.message?.includes("email already exists") ||
          errorData.detail?.includes("email already exists") ||
          errorData.email?.includes("already exists") ||
          errorData.email?.some?.(msg => msg.includes("already exists"))
        ) {
          setShowDuplicateEmailModal(true);
        } else {
          setError(errorData.message || "Hmmm... we can't seem to register your business on LAGBUY. If this persists, please contact support.");
        }
      } else {
        setError("Signup failed. Please check your connection and try again.");
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
    onSwitch("login");
  };

  const handleCloseDuplicateEmailModal = () => {
    setShowDuplicateEmailModal(false);
    setFormData(prev => ({ ...prev, email: "" }));
    setStep(1);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-lg shadow-lg" 
         style={{ 
           backgroundColor: 'rgba(255, 255, 255, 1)',
           border: '2px solid rgba(252, 230, 0, 1)'
         }}>
      <h2 className="text-2xl font-bold mb-6 text-center" 
          style={{ color: 'rgba(17, 36, 29, 1)' }}>
        Create Account 👤
      </h2>
      
      {error && (
        <div className="text-red-500 text-sm mb-4 text-center p-3 rounded-md" 
             style={{ 
               backgroundColor: 'rgba(255, 249, 183, 0.3)',
               border: '1px solid rgba(252, 230, 0, 1)'
             }}>
          {error}
        </div>
      )}
      
      {step === 1 && (
        <form onSubmit={handleSkipEmailVerification} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium" 
                   style={{ color: 'rgba(17, 36, 29, 1)' }}>
              Email
            </label>
            <input
              type="text"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200"
              style={{ 
                borderColor: 'rgba(165, 244, 213, 1)',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                color: 'rgba(17, 36, 29, 1)'
              }}
              placeholder="Enter your valid email"
            />
          </div>
          <button
            type="submit"
            className="w-full font-bold py-3 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            style={{ 
              backgroundColor: 'rgba(26, 54, 43, 1)',
              color: 'rgba(255, 255, 255, 1)'
            }}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Continue"}
          </button>
          <div className="text-sm mt-4 text-center" style={{ color: 'rgba(17, 36, 29, 0.8)' }}>
            <p>
              Already have an account?
              <button
                onClick={() => onSwitch("login")}
                className="ml-1 font-semibold hover:underline transition-colors duration-200"
                style={{ color: 'rgba(26, 54, 43, 1)' }}
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
            <label className="block mb-2 text-sm font-medium" 
                   style={{ color: 'rgba(17, 36, 29, 1)' }}>
              First Name
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200"
              style={{ 
                borderColor: 'rgba(165, 244, 213, 1)',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                color: 'rgba(17, 36, 29, 1)'
              }}
              placeholder="Enter your first name"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium" 
                   style={{ color: 'rgba(17, 36, 29, 1)' }}>
              Last Name
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200"
              style={{ 
                borderColor: 'rgba(165, 244, 213, 1)',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                color: 'rgba(17, 36, 29, 1)'
              }}
              placeholder="Enter your last name"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium" 
                   style={{ color: 'rgba(17, 36, 29, 1)' }}>
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200"
              style={{ 
                borderColor: 'rgba(165, 244, 213, 1)',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                color: 'rgba(17, 36, 29, 1)'
              }}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium" 
                   style={{ color: 'rgba(17, 36, 29, 1)' }}>
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200"
              style={{ 
                borderColor: 'rgba(165, 244, 213, 1)',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                color: 'rgba(17, 36, 29, 1)'
              }}
              placeholder="Enter your address"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium" 
                   style={{ color: 'rgba(17, 36, 29, 1)' }}>
              Your City
            </label>
            <input
              type="text"
              required
              value={formData.userCity}
              onChange={(e) => handleInputChange('userCity', e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200"
              style={{ 
                borderColor: 'rgba(165, 244, 213, 1)',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                color: 'rgba(17, 36, 29, 1)'
              }}
              placeholder="Enter your city"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium" 
                   style={{ color: 'rgba(17, 36, 29, 1)' }}>
              Your State
            </label>
            <input
              type="text"
              required
              value={formData.userState}
              onChange={(e) => handleInputChange('userState', e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200"
              style={{ 
                borderColor: 'rgba(165, 244, 213, 1)',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                color: 'rgba(17, 36, 29, 1)'
              }}
              placeholder="Enter your state"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium" 
                   style={{ color: 'rgba(17, 36, 29, 1)' }}>
              Date of Birth
            </label>
            <input
              type="date"
              required
              value={formData.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200"
              style={{ 
                borderColor: 'rgba(165, 244, 213, 1)',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                color: 'rgba(17, 36, 29, 1)'
              }}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium" 
                   style={{ color: 'rgba(17, 36, 29, 1)' }}>
              Phone Number
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200"
              style={{ 
                borderColor: 'rgba(165, 244, 213, 1)',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                color: 'rgba(17, 36, 29, 1)'
              }}
              placeholder="Enter your phone number (e.g., 08012345678)"
            />
          </div>
          
          <button
            type="button"
            onClick={() => {
              setError("");
              if (validateStep3()) {
                setStep(4);
              }
            }}
            className="w-full font-bold py-3 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            style={{ 
              backgroundColor: 'rgba(26, 54, 43, 1)',
              color: 'rgba(255, 255, 255, 1)'
            }}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Continue"}
          </button>
          
          <div className="text-sm mt-4 text-center" style={{ color: 'rgba(17, 36, 29, 0.8)' }}>
            <p>
              <button
                onClick={handleBack}
                className="font-semibold hover:underline transition-colors duration-200"
                style={{ color: 'rgba(26, 54, 43, 1)' }}
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
            <label className="block mb-2 text-sm font-medium" 
                   style={{ color: 'rgba(17, 36, 29, 1)' }}>
              Business Name
            </label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200"
              style={{ 
                borderColor: 'rgba(165, 244, 213, 1)',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                color: 'rgba(17, 36, 29, 1)'
              }}
              placeholder="Enter your business name"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium" 
                   style={{ color: 'rgba(17, 36, 29, 1)' }}>
              Business Location City
            </label>
            <input
              type="text"
              required
              value={formData.businessLocationCity}
              onChange={(e) => handleInputChange('businessLocationCity', e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200"
              style={{ 
                borderColor: 'rgba(165, 244, 213, 1)',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                color: 'rgba(17, 36, 29, 1)'
              }}
              placeholder="Enter your business city"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium" 
                   style={{ color: 'rgba(17, 36, 29, 1)' }}>
              Business Location State
            </label>
            <input
              type="text"
              required
              value={formData.businessLocationState}
              onChange={(e) => handleInputChange('businessLocationState', e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200"
              style={{ 
                borderColor: 'rgba(165, 244, 213, 1)',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                color: 'rgba(17, 36, 29, 1)'
              }}
              placeholder="Enter your business state"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium" 
                   style={{ color: 'rgba(17, 36, 29, 1)' }}>
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 pr-10"
                style={{ 
                  borderColor: 'rgba(165, 244, 213, 1)',
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  color: 'rgba(17, 36, 29, 1)'
                }}
                placeholder="Enter your password"
              />
              <span
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-3 cursor-pointer"
                style={{ color: 'rgba(26, 54, 43, 1)' }}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium" 
                   style={{ color: 'rgba(17, 36, 29, 1)' }}>
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 pr-10"
                style={{ 
                  borderColor: 'rgba(165, 244, 213, 1)',
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  color: 'rgba(17, 36, 29, 1)'
                }}
                placeholder="Confirm your password"
              />
              <span
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                className="absolute right-3 top-3 cursor-pointer"
                style={{ color: 'rgba(26, 54, 43, 1)' }}
              >
                {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full font-bold py-3 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            style={{ 
              backgroundColor: 'rgba(26, 54, 43, 1)',
              color: 'rgba(255, 255, 255, 1)'
            }}
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
          
          <div className="text-sm mt-4 text-center" style={{ color: 'rgba(17, 36, 29, 0.8)' }}>
            <p>
              <button
                onClick={handleBack}
                className="font-semibold hover:underline transition-colors duration-200"
                style={{ color: 'rgba(26, 54, 43, 1)' }}
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
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border-2"
               style={{ borderColor: 'rgba(252, 230, 0, 1)' }}>
            <h3 className="text-xl font-bold text-center mb-4" 
                style={{ color: 'rgba(17, 36, 29, 1)' }}>
              Congratulations!
            </h3>
            <p className="text-center mb-4" style={{ color: 'rgba(17, 36, 29, 0.8)' }}>
              Your vendor account has been created successfully. A verification email has been sent to {formData.email}. Please check your inbox (and spam/junk folder) and click the verification link to activate your vendor status and add products. If you need assistance, contact{" "}
              <a
                href="mailto:support@lagbuy.com"
                className="font-semibold hover:underline"
                style={{ color: 'rgba(26, 54, 43, 1)' }}
              >
                support@lagbuy.com
              </a>.
            </p>
            <div className="text-center">
              <button
                onClick={handleCloseSuccessModal}
                className="font-bold py-2 px-4 rounded hover:shadow-lg transition duration-200"
                style={{ 
                  backgroundColor: 'rgba(26, 54, 43, 1)',
                  color: 'rgba(255, 255, 255, 1)'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showDuplicateEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border-2"
               style={{ borderColor: 'rgba(252, 230, 0, 1)' }}>
            <h3 className="text-xl font-bold text-center mb-4" 
                style={{ color: 'rgba(17, 36, 29, 1)' }}>
              Email Already Exists
            </h3>
            <p className="text-center mb-4" style={{ color: 'rgba(17, 36, 29, 0.8)' }}>
              The email you entered already exists. Do you have an alternative email?
            </p>
            <div className="text-center space-x-4">
              <button
                onClick={handleCloseDuplicateEmailModal}
                className="font-bold py-2 px-4 rounded hover:shadow-lg transition duration-200"
                style={{ 
                  backgroundColor: 'rgba(26, 54, 43, 1)',
                  color: 'rgba(255, 255, 255, 1)'
                }}
              >
                Try Another Email
              </button>
              <button
                onClick={() => {
                  setShowDuplicateEmailModal(false);
                  onSwitch("login");
                }}
                className="font-bold py-2 px-4 rounded hover:shadow-lg transition duration-200"
                style={{ 
                  backgroundColor: 'rgba(165, 244, 213, 1)',
                  color: 'rgba(17, 36, 29, 1)'
                }}
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