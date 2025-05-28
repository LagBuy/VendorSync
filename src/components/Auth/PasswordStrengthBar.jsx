const PasswordStrengthBar = ({ strength }) => (
  <div className="mt-2">
    <div
      className={`h-2 rounded-full ${
        strength === 0
          ? "bg-gray-300"
          : strength === 1
          ? "bg-red-500"
          : strength === 2
          ? "bg-yellow-500"
          : strength === 3
          ? "bg-green-500"
          : "bg-blue-500"
      }`}
    ></div>
    <div className="text-sm mt-1 text-gray-600">
      {strength === 0
        ? "Weak"
        : strength === 1
        ? "Weak"
        : strength === 2
        ? "Medium"
        : strength === 3
        ? "Strong"
        : "Very Strong"}
    </div>
  </div>
);

export default PasswordStrengthBar;