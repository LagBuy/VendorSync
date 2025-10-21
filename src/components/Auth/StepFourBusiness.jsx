import PasswordStrengthBar from "./PasswordStrengthBar";
import {
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaDollarSign,
  FaPhone,
  FaLock,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const StepFourBusiness = ({
  businessType,
  setBusinessType,
  customBusinessType,
  setCustomBusinessType,
  dependsOnDollarRate,
  setDependsOnDollarRate,
  phone,
  setPhone,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  handleProceed,
  handleBack,
  passwordStrength,
}) => {
  return (
    <div className="space-y-6">
      {/* Business Type */}
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold pl-1"
          style={{ color: "rgba(17, 36, 29, 1)" }}
        >
          Business Type
        </label>
        <div className="relative">
          <div
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
            style={{ color: "rgba(26, 54, 43, 0.6)" }}
          >
            <FaBuilding size={16} />
          </div>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full pl-12 pr-10 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 appearance-none cursor-pointer"
            style={{
              borderColor: "rgba(165, 244, 213, 1)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              color: "rgba(17, 36, 29, 1)",
              focusRingColor: "rgba(252, 230, 0, 0.3)",
            }}
          >
            <option value="">Select Business Type</option>
            <option value="Retail">Retail</option>
            <option value="Consulting">Consulting</option>
            <option value="Education">Education</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Marketing">Marketing</option>
            <option value="Food & Beverage">Food & Beverage</option>
            <option value="Entertainment">Entertainment</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Other">Other</option>
          </select>
          <div
            className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
            style={{ color: "rgba(26, 54, 43, 0.6)" }}
          >
            <span className="text-sm">▼</span>
          </div>
        </div>
      </div>

      {/* Custom Business Type */}
      {businessType === "Other" && (
        <div className="space-y-2 animate-fadeIn">
          <label
            className="block text-sm font-semibold pl-1"
            style={{ color: "rgba(17, 36, 29, 1)" }}
          >
            Custom Business Type
          </label>
          <div className="relative">
            <div
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              style={{ color: "rgba(26, 54, 43, 0.6)" }}
            >
              <FaBuilding size={16} />
            </div>
            <input
              type="text"
              value={customBusinessType}
              onChange={(e) => setCustomBusinessType(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 placeholder-opacity-60"
              style={{
                borderColor: "rgba(165, 244, 213, 1)",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                color: "rgba(17, 36, 29, 1)",
                focusRingColor: "rgba(252, 230, 0, 0.3)",
              }}
              placeholder="Enter your specific business type"
            />
          </div>
        </div>
      )}

      {/* Dollar Rate Dependency */}
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold pl-1"
          style={{ color: "rgba(17, 36, 29, 1)" }}
        >
          Depends on Dollar Rate?
        </label>
        <div className="relative">
          <div
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
            style={{ color: "rgba(26, 54, 43, 0.6)" }}
          >
            <FaDollarSign size={16} />
          </div>
          <select
            value={dependsOnDollarRate}
            onChange={(e) => setDependsOnDollarRate(e.target.value)}
            className="w-full pl-12 pr-10 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 appearance-none cursor-pointer"
            style={{
              borderColor: "rgba(165, 244, 213, 1)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              color: "rgba(17, 36, 29, 1)",
              focusRingColor: "rgba(252, 230, 0, 0.3)",
            }}
          >
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <div
            className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
            style={{ color: "rgba(26, 54, 43, 0.6)" }}
          >
            <span className="text-sm">▼</span>
          </div>
        </div>
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold pl-1"
          style={{ color: "rgba(17, 36, 29, 1)" }}
        >
          Phone Number
        </label>
        <div className="relative">
          <div
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
            style={{ color: "rgba(26, 54, 43, 0.6)" }}
          >
            <FaPhone size={16} />
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 placeholder-opacity-60"
            style={{
              borderColor: "rgba(165, 244, 213, 1)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              color: "rgba(17, 36, 29, 1)",
              focusRingColor: "rgba(252, 230, 0, 0.3)",
            }}
            placeholder="e.g., 08012345678"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold pl-1"
          style={{ color: "rgba(17, 36, 29, 1)" }}
        >
          Password
        </label>
        <div className="relative">
          <div
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
            style={{ color: "rgba(26, 54, 43, 0.6)" }}
          >
            <FaLock size={16} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-12 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 placeholder-opacity-60"
            style={{
              borderColor: "rgba(165, 244, 213, 1)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              color: "rgba(17, 36, 29, 1)",
              focusRingColor: "rgba(252, 230, 0, 0.3)",
            }}
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 hover:scale-110"
            style={{ color: "rgba(26, 54, 43, 0.7)" }}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>
        <div className="mt-3">
          <PasswordStrengthBar strength={passwordStrength} />
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold pl-1"
          style={{ color: "rgba(17, 36, 29, 1)" }}
        >
          Confirm Password
        </label>
        <div className="relative">
          <div
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
            style={{ color: "rgba(26, 54, 43, 0.6)" }}
          >
            <FaLock size={16} />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-12 pr-12 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 placeholder-opacity-60"
            style={{
              borderColor: "rgba(165, 244, 213, 1)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              color: "rgba(17, 36, 29, 1)",
              focusRingColor: "rgba(252, 230, 0, 0.3)",
            }}
            placeholder="Re-enter your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 hover:scale-110"
            style={{ color: "rgba(26, 54, 43, 0.7)" }}
          >
            {showConfirmPassword ? (
              <FaEyeSlash size={18} />
            ) : (
              <FaEye size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-6">
        <button
          onClick={handleBack}
          className="flex-1 py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3 group"
          style={{
            backgroundColor: "rgba(252, 230, 0, 0.1)",
            border: "2px solid rgba(252, 230, 0, 1)",
            color: "rgba(17, 36, 29, 1)",
          }}
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back</span>
        </button>

        <button
          onClick={handleProceed}
          className="flex-1 py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3 group"
          style={{
            backgroundColor: "rgba(26, 54, 43, 1)",
            backgroundImage:
              "linear-gradient(135deg, rgba(26, 54, 43, 1) 0%, rgba(17, 36, 29, 1) 100%)",
          }}
        >
          <span>Complete Registration</span>
          <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
};

export default StepFourBusiness;
