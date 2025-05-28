import PasswordStrengthBar from "./PasswordStrengthBar";

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
    <div className="space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Business Type</label>
        <select
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
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
      {businessType === "Other" && (
        <div>
          <label className="block mb-1 text-sm font-medium">Custom Business Type</label>
          <input
            type="text"
            value={customBusinessType}
            onChange={(e) => setCustomBusinessType(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Enter custom business type"
          />
        </div>
      )}
      <div>
        <label className="block mb-1 text-sm font-medium">Depends on Dollar Rate</label>
        <select
          value={dependsOnDollarRate}
          onChange={(e) => setDependsOnDollarRate(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="">Select Option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="e.g., 08012345678"
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <PasswordStrengthBar strength={passwordStrength} />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Re-enter password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={handleBack}
          className="w-full mr-2 bg-gray-600 text-white py-2 rounded-md"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleProceed}
          className="w-full ml-2 bg-blue-600 text-white py-2 rounded-md"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default StepFourBusiness;