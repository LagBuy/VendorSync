import PasswordStrengthBar from "./PasswordStrengthBar";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
      <div>
        <label className="block mb-3 text-sm font-semibold" 
               style={{ color: 'rgba(17, 36, 29, 1)' }}>
          Business Type
        </label>
        <select
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
          style={{ 
            borderColor: 'rgba(165, 244, 213, 1)',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            color: 'rgba(17, 36, 29, 1)',
            focusBorderColor: 'rgba(252, 230, 0, 1)'
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
      </div>

      {/* Custom Business Type */}
      {businessType === "Other" && (
        <div className="animate-fadeIn">
          <label className="block mb-3 text-sm font-semibold" 
                 style={{ color: 'rgba(17, 36, 29, 1)' }}>
            Custom Business Type
          </label>
          <input
            type="text"
            value={customBusinessType}
            onChange={(e) => setCustomBusinessType(e.target.value)}
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
            style={{ 
              borderColor: 'rgba(165, 244, 213, 1)',
              backgroundColor: 'rgba(255, 255, 255, 1)',
              color: 'rgba(17, 36, 29, 1)'
            }}
            placeholder="Enter your specific business type"
          />
        </div>
      )}

      {/* Dollar Rate Dependency */}
      <div>
        <label className="block mb-3 text-sm font-semibold" 
               style={{ color: 'rgba(17, 36, 29, 1)' }}>
          Depends on Dollar Rate?
        </label>
        <select
          value={dependsOnDollarRate}
          onChange={(e) => setDependsOnDollarRate(e.target.value)}
          className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
          style={{ 
            borderColor: 'rgba(165, 244, 213, 1)',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            color: 'rgba(17, 36, 29, 1)'
          }}
        >
          <option value="">Select Option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* Phone Number */}
      <div>
        <label className="block mb-3 text-sm font-semibold" 
               style={{ color: 'rgba(17, 36, 29, 1)' }}>
          Phone Number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
          style={{ 
            borderColor: 'rgba(165, 244, 213, 1)',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            color: 'rgba(17, 36, 29, 1)'
          }}
          placeholder="e.g., 08012345678"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block mb-3 text-sm font-semibold" 
               style={{ color: 'rgba(17, 36, 29, 1)' }}>
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 pr-12"
            style={{ 
              borderColor: 'rgba(165, 244, 213, 1)',
              backgroundColor: 'rgba(255, 255, 255, 1)',
              color: 'rgba(17, 36, 29, 1)'
            }}
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-colors duration-200 hover:bg-gray-100"
            style={{ color: 'rgba(26, 54, 43, 1)' }}
          >
            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
          </button>
        </div>
        <div className="mt-2">
          <PasswordStrengthBar strength={passwordStrength} />
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block mb-3 text-sm font-semibold" 
               style={{ color: 'rgba(17, 36, 29, 1)' }}>
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 pr-12"
            style={{ 
              borderColor: 'rgba(165, 244, 213, 1)',
              backgroundColor: 'rgba(255, 255, 255, 1)',
              color: 'rgba(17, 36, 29, 1)'
            }}
            placeholder="Re-enter your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-colors duration-200 hover:bg-gray-100"
            style={{ color: 'rgba(26, 54, 43, 1)' }}
          >
            {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg border-2"
          style={{ 
            borderColor: 'rgba(165, 244, 213, 1)',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            color: 'rgba(26, 54, 43, 1)',
            hoverBorderColor: 'rgba(252, 230, 0, 1)'
          }}
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleProceed}
          className="flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
          style={{ 
            backgroundColor: 'rgba(26, 54, 43, 1)',
            color: 'rgba(255, 255, 255, 1)',
            hoverBackgroundColor: 'rgba(17, 36, 29, 1)'
          }}
        >
          Complete Registration
        </button>
      </div>
    </div>
  );
};

export default StepFourBusiness;