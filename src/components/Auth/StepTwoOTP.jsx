const StepTwoOTP = ({ otp, setOtp, handleProceed, handleBack }) => (
  <>
    <div>
      <label className="block mb-1 text-sm font-medium">Enter OTP</label>
      <input
        type="text"
        required
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
      />
    </div>
    <button
      onClick={handleBack}
      className="w-full bg-gray-600 text-white py-2 rounded-md"
    >
      Back
    </button>
    <button
      onClick={handleProceed}
      className="w-full bg-blue-600 text-white py-2 rounded-md"
    >
      Proceed
    </button>
  </>
);

export default StepTwoOTP;
