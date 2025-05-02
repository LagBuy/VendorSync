const ConfirmSignOut = ({ onConfirm, onCancel }) => {
  return (
    <div className="text-gray-800 dark:text-dark">
      <p className="mb-4">Are you sure you want to log out of your account?</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ConfirmSignOut;
