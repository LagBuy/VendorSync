import { useState, useRef } from "react";
import { MdOutlineVerified } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyPage = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [frontProgress, setFrontProgress] = useState(0);
  const [backProgress, setBackProgress] = useState(0);

  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const documentOptions = [
    "My Driver's License",
    "International Passport",
    "Use My NIN Document",
    "Personal Voter's Card",
  ];

  const simulateUpload = (file, setProgress, setImage, setPreview) => {
    setProgress(0);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setImage(file);
        setPreview(URL.createObjectURL(file));
      }
    }, 100);
  };

  const handleImageChange = (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    if (side === "front") {
      simulateUpload(file, setFrontProgress, setFrontImage, setFrontPreview);
    } else {
      simulateUpload(file, setBackProgress, setBackImage, setBackPreview);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      frontImage &&
      backImage &&
      frontProgress === 100 &&
      backProgress === 100
    ) {
      toast.success(`${selectedOption} submitted successfully.`, {
        position: "top-center",
      });

      // Clear file inputs
      setFrontImage(null);
      setBackImage(null);
      setFrontPreview(null);
      setBackPreview(null);
      setFrontProgress(0);
      setBackProgress(0);
      if (frontInputRef.current) frontInputRef.current.value = "";
      if (backInputRef.current) backInputRef.current.value = "";
    } else {
      toast.error("Please upload both front and back images completely.", {
        position: "top-center",
      });
    }
  };

  const resetAll = () => {
    setShowOptions(false);
    setSelectedOption(null);
    setFrontImage(null);
    setBackImage(null);
    setFrontPreview(null);
    setBackPreview(null);
    setFrontProgress(0);
    setBackProgress(0);
    if (frontInputRef.current) frontInputRef.current.value = "";
    if (backInputRef.current) backInputRef.current.value = "";
  };

  return (
    <div className="bg-white-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-blue-700 mb-8">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center">
        <MdOutlineVerified className="text-white-100 mr-3" size={24} />
        Get Verified
      </h2>
      <p className="text-xs text-gray-100 text-left mt-6 my-6">
        Make sure your document is valid and clearly visible.
      </p>
      {/* Step 1: Show "Verify Me" Button */}
      {!showOptions && !selectedOption && (
        <button
          onClick={() => setShowOptions(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Verify Me
        </button>
      )}

      {/* Step 2: Show Options */}
      {showOptions && !selectedOption && (
        <div className="space-y-4">
          <p className="text-sm text-gray-100 text-center mb-4">
            Please, select a means of verification
          </p>
          {documentOptions.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedOption(option)}
              className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded"
            >
              {option}
            </button>
          ))}
          <button
            type="button"
            onClick={resetAll}
            className="w-full text-sm text-gray-100 underline mt-4"
          >
            Go Back
          </button>
        </div>
      )}

      {/* Step 3: Upload Files */}
      {selectedOption && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold text-center">
            Upload {selectedOption}
          </h3>

          {/* Front Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Front Image
            </label>
            <input
              type="file"
              accept="image/*"
              ref={frontInputRef}
              required
              onChange={(e) => handleImageChange(e, "front")}
              className="w-full"
            />
            {frontProgress > 0 && (
              <div className="h-2 bg-gray-200 rounded mt-2">
                <div
                  className="h-2 bg-blue-600 rounded"
                  style={{ width: `${frontProgress}%` }}
                ></div>
              </div>
            )}
            {frontPreview && (
              <img
                src={frontPreview}
                alt="Front Preview"
                className="mt-2 h-40 object-cover rounded border"
              />
            )}
          </div>

          {/* Back Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Back Image</label>
            <input
              type="file"
              accept="image/*"
              ref={backInputRef}
              required
              onChange={(e) => handleImageChange(e, "back")}
              className="w-full"
            />
            {backProgress > 0 && (
              <div className="h-2 bg-gray-200 rounded mt-2">
                <div
                  className="h-2 bg-blue-600 rounded"
                  style={{ width: `${backProgress}%` }}
                ></div>
              </div>
            )}
            {backPreview && (
              <img
                src={backPreview}
                alt="Back Preview"
                className="mt-2 h-40 object-cover rounded border"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit for Review
          </button>

          <button
            type="button"
            onClick={resetAll}
            className="w-full text-sm text-gray-100 underline mt-2"
          >
            Go Back
          </button>
        </form>
      )}
    </div>
  );
};

export default VerifyPage;
