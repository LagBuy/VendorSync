import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios-instance/axios-instance";
import { Lock } from "lucide-react";
import SettingSection from "./SettingSection";
import ToggleSwitch from "./ToggleSwitch";
import Modal from "antd/es/modal/Modal";
import ChangePassword from "./ChangePassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Security = () => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [password, setPassword] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isFaceScanned, setIsFaceScanned] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Fetch 2FA status on mount
  useEffect(() => {
    const fetchTwoFactorStatus = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/two-factor");
        setTwoFactor(data.enabled ?? false);
        setIsFaceScanned(data.enabled ?? false); // Assume face scan is complete if 2FA is enabled
        toast.success("2FA settings loaded successfully!");
      } catch (error) {
        console.error("Error fetching 2FA status:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.message || "Failed to load 2FA settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchTwoFactorStatus();
  }, []);

  // Start face scan by accessing camera
  const startFaceScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (err) {
      console.error("Error accessing the camera:", err);
      toast.error("Failed to access camera for face scan.");
      setIsScanning(false);
    }
  };

  // Stop face scan and finalize the process
  const stopFaceScan = async () => {
    const stream = videoRef.current?.srcObject;
    const tracks = stream?.getTracks();
    tracks?.forEach((track) => track.stop());
    setIsScanning(false);

    if (capturedImage) {
      setLoading(true);
      try {
        await axiosInstance.post("/face-scan", { image: capturedImage });
        setIsFaceScanned(true);
        toast.success("Face scan completed successfully!");
      } catch (error) {
        console.error("Error uploading face scan:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(error.response?.data?.message || "Failed to upload face scan.");
        setTwoFactor(false); // Revert 2FA if face scan fails
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please capture a face image before completing the scan.");
      setTwoFactor(false); // Revert 2FA if no image is captured
    }
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
      setCapturedImage(image);
      toast.success("Face captured successfully!");
    }
  };

  // Update 2FA status
  const handleTwoFactorToggle = async () => {
    const newTwoFactor = !twoFactor;
    setLoading(true);
    try {
      await axiosInstance.patch("/two-factor", { enabled: newTwoFactor });
      setTwoFactor(newTwoFactor);
      if (newTwoFactor) {
        startFaceScan();
      } else {
        stopFaceScan();
        setIsFaceScanned(false);
        setCapturedImage(null);
      }
      toast.success(`2FA ${newTwoFactor ? "enabled" : "disabled"} successfully!`);
    } catch (error) {
      console.error("Error updating 2FA status:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      toast.error(error.response?.data?.message || "Failed to update 2FA status.");
    } finally {
      setLoading(false);
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
          onToggle={handleTwoFactorToggle}
          disabled={loading}
        />
        <div className="mt-4">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            onClick={() => setPassword(true)}
            disabled={loading}
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
              Please align your face within the frame to enable two-factor authentication.
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
              style={{ display: "none" }}
            ></canvas>
            <button
              onClick={captureFace}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              disabled={loading}
            >
              Capture Face
            </button>
            <button
              onClick={stopFaceScan}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 mt-4"
              disabled={loading}
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

      <ToastContainer />
    </>
  );
};

export default Security;