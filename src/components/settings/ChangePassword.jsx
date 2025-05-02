import { useState } from "react";
import { toast } from "react-toastify";

const getPasswordStrength = (password) => {
  if (
    password.length >= 12 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  ) {
    return "Strong";
  } else if (password.length >= 8) {
    return "Medium";
  }
  return "Weak";
};

const ChangePassword = () => {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const strength = getPasswordStrength(newPass);
  const strengthColor = {
    Weak: "text-red-500",
    Medium: "text-yellow-500",
    Strong: "text-green-500",
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if fields are empty
    if (!current || !newPass || !confirm) {
      toast.error("Please fill all fields.");
      return;
    }

    // Check if passwords match
    if (newPass !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    // Check password strength
    if (strength === "Weak") {
      toast.error("Choose a stronger password.");
      return;
    }

    toast.success("Password changed successfully!");
    // Add real save logic here
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      <input
        type="password"
        placeholder="Current password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        className="bg-gray-700 text-white px-3 py-2 rounded"
      />
      <input
        type="password"
        placeholder="New password"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
        className="bg-gray-700 text-white px-3 py-2 rounded"
      />
      {newPass && (
        <p className={`text-sm font-medium ${strengthColor[strength]}`}>
          Strength: {strength}
        </p>
      )}
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="bg-gray-700 text-white px-3 py-2 rounded"
      />
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Save Changes
      </button>
    </form>
  );
};

export default ChangePassword;
