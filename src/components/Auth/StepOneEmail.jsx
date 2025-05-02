const StepOneEmail = ({ email, setEmail, handleProceed, onSwitch }) => (
  <>
    <div>
      <label className="block mb-1 text-sm font-medium">Email</label>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
      />
    </div>
    <button
      onClick={handleProceed}
      type="button"
      className="w-full bg-blue-600 text-white py-2 rounded-md"
    >
      Proceed
    </button>
    <p className="text-center mt-4 text-sm">
      Already have an account?{" "}
      <button
        onClick={() => onSwitch("login")}
        className="text-blue-600 hover:underline"
      >
        Back to Login
      </button>
    </p>
  </>
);

export default StepOneEmail;
