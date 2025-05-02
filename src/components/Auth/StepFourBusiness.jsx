import PasswordStrengthBar from "./PasswordStrengthBar";

const StepFourBusiness = ({
  formData,
  handleChange,
  handleProceed,
  handleBack,
  passwordStrength,
  businessTypes,
  dollarRates,
}) => {
  return (
    <div className="space-y-4">
      {/* Business Type */}
      <div>
        <label className="block text-sm font-medium">Business Type</label>
        <select
          name="businessType"
          value={formData.businessType}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select a business type</option>
          {businessTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Dollar Rate Dropdown */}
      <div>
        <label className="block text-sm font-medium">Dollar Rate</label>
        <select
          name="dollarRate"
          value={formData.dollarRate}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select exchange rate</option>
          {dollarRates.map((rate, index) => (
            <option key={index} value={rate}>
              {rate} NGN/USD
            </option>
          ))}
        </select>
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium">Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter phone number"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Create a strong password"
        />
        <PasswordStrengthBar strength={passwordStrength} />
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Re-enter password"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleProceed}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default StepFourBusiness;
