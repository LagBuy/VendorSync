const PasswordStrengthBar = ({ strength }) => {
  const getColor = () => {
    if (strength < 2) return "bg-red-500";
    if (strength < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="w-full h-2 bg-gray-200 rounded mt-1">
      <div
        className={`h-full ${getColor()} rounded transition-all duration-300`}
        style={{ width: `${(strength / 5) * 100}%` }}
      />
    </div>
  );
};

export default PasswordStrengthBar;
