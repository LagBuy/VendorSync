import { Lock } from "lucide-react";
import SettingSection from "./SettingSection";
import ToggleSwitch from "./ToggleSwitch";
import { useState, useRef, useEffect } from "react";
import Modal from "antd/es/modal/Modal";
import ChangePassword from "./ChangePassword";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the styles

const Security = () => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [password, setPassword] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isFaceScanned, setIsFaceScanned] = useState(false); // Track if face scan is successful
  const [capturedImage, setCapturedImage] = useState(null); // To store captured face image
  const videoRef = useRef(null); // Reference to video element
  const canvasRef = useRef(null); // Reference to canvas element

  // Start face scan by accessing camera
  const startFaceScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true); // Set isScanning to true when camera is active
      }
    } catch (err) {
      console.error("Error accessing the camera: ", err);
      setIsScanning(false); // In case of error, stop scanning
    }
  };

  // Stop face scan and finalize the process
  const stopFaceScan = () => {
    const stream = videoRef.current?.srcObject;
    const tracks = stream?.getTracks();
    tracks?.forEach((track) => track.stop());
    setIsScanning(false);
    setIsFaceScanned(true); // Simulate successful face scan
  };

  // Capture image from video stream
  const captureFace = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = canvas.toDataURL("image/png");
      setCapturedImage(image); // Save the captured image
    }
  };

  // Effect to automatically stop scanning when 2FA is turned off
  useEffect(() => {
    if (!twoFactor && videoRef.current?.srcObject) {
      stopFaceScan();
    }
  }, [twoFactor]);

  return (
    <>
      <SettingSection icon={Lock} title={"Security"}>
        <ToggleSwitch
          label={"Two-Factor Authentication"}
          isOn={twoFactor}
          onToggle={() => {
            setTwoFactor(!twoFactor);
            if (!twoFactor) {
              startFaceScan(); // Start scanning when enabled
            } else {
              stopFaceScan(); // Stop scanning if 2FA is disabled
            }
          }}
        />
        <div className="mt-4">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded
          transition duration-200"
            onClick={() => setPassword(true)}
          >
            Change Password
          </button>
          <Modal
            open={password}
            onCancel={() => setPassword(false)}
            footer={null}
          >
            <ChangePassword />
          </Modal>
        </div>

        {/* Face Scan Section */}
        {twoFactor && !isFaceScanned && isScanning && (
          <div className="mt-6 text-center">
            <h4 className="text-gray-100 text-lg font-semibold">
              Face Scan for 2FA
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Please align your face within the frame to enable two-factor
              authentication.
            </p>
            <div className="flex justify-center mb-4">
              <video
                ref={videoRef}
                autoPlay
                className="w-72 h-72 border-2 border-gray-500 rounded-lg"
              ></video>
            </div>
            <canvas
              ref={canvasRef}
              style={{ display: "none" }} // Hide the canvas
            ></canvas>
            <button
              onClick={captureFace}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              Capture Face
            </button>
            <button
              onClick={stopFaceScan}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 mt-4"
            >
              Complete Face Scan
            </button>
          </div>
        )}

        {/* Display Captured Image */}
        {capturedImage && !isFaceScanned && (
          <div className="mt-6 text-center">
            <h4 className="text-green-500 font-semibold">
              Face Captured Successfully!
            </h4>
            <img
              src={capturedImage}
              alt="Captured Face"
              className="w-32 h-32 object-cover rounded-full border-2 border-gray-500 mt-4"
            />
            <p className="text-gray-400 text-sm mt-2">
              This is your captured face for 2FA.
            </p>
          </div>
        )}

        {/* Success Message */}
        {isFaceScanned && twoFactor && (
          <div className="mt-4 text-center">
            <h4 className="text-green-500 font-semibold">
              Face Scan Successful!
            </h4>
            <p className="text-gray-400 text-sm">
              Two-factor authentication is now enabled.
            </p>
          </div>
        )}
      </SettingSection>

      {/* Add the ToastContainer here so that it's available globally */}
      <ToastContainer />
    </>
  );
};

export default Security;
