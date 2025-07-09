import { useState } from "react";

const StepOneEmail = ({ email, setEmail, handleProceed, onSwitch }) => {
  const [error, setError] = useState("");

  const validateAndProceed = () => {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.(com|net|org)$/i;

    if (!emailPattern.test(email)) {
      setError("Email must end with .com, .net, or .org");
      return;
    }

    setError("");
    handleProceed();
  };

  return (
    <>
      <div>
        <label className="block mb-1 text-sm font-medium text-[#FFF9B0]">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md bg-[#1A362B] text-[#FFF9B0] border-[#FFF9B0]"
          placeholder="example@email.com"
        />
        {error && <p className="text-[#D32F2F] text-sm mt-1">{error}</p>}
      </div>

      <button
        onClick={validateAndProceed}
        type="button"
        className="w-full bg-[#2E7D32] text-[#fff371] py-2 rounded-md mt-4"
      >
        Proceed
      </button>

      <p className="text-center mt-4 text-sm text-[#FFF9B0]">
        Already have an account? {" "}
        <button
          onClick={() => onSwitch("login")}
          className="text-[#2E7D32] hover:underline"
        >
          Back to Login
        </button>
      </p>
    </>
  );
};

export default StepOneEmail;