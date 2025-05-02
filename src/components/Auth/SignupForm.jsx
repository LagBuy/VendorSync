import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StepOneEmail from "./StepOneEmail";
import StepTwoOTP from "./StepTwoOTP";
import StepThreePersonal from "./StepThreePersonal";
import StepFourBusiness from "./StepFourBusiness";

const SignupForm = ({ onSwitch }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");

  // All form fields:
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [customBusinessType, setCustomBusinessType] = useState("");
  const [dependsOnDollarRate, setDependsOnDollarRate] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    toast.success(`Signed up successfully with email: ${email}`);
  };

  const handleProceed = () => {
    if (step === 1 && email) {
      const otpCode = Math.floor(100000 + Math.random() * 900000);
      setGeneratedOtp(otpCode.toString());
      setOtpSent(true);
      toast.success(`OTP sent to ${email}: ${otpCode}`);
      setStep(2);
    } else if (step === 2 && otp === generatedOtp) {
      setStep(3);
    } else if (step === 2 && otp !== generatedOtp) {
      toast.error("Incorrect OTP. Please try again.");
    } else if (step === 3 && validatePersonalDetails()) {
      setStep(4);
    } else if (step === 4 && validateBusinessDetails()) {
      handleSignup();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const validatePersonalDetails = () => {
    const namePattern = /^[A-Za-z]+$/;
    if (
      !firstName ||
      !lastName ||
      !namePattern.test(firstName) ||
      !namePattern.test(lastName)
    ) {
      toast.error("First and Last names must contain only letters.");
      return false;
    }
    if (
      firstName[0] !== firstName[0].toUpperCase() ||
      lastName[0] !== lastName[0].toUpperCase()
    ) {
      toast.error("Names must start with a capital letter.");
      return false;
    }
    const dobPattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dob || !dobPattern.test(dob)) {
      toast.error("Date of Birth must be in dd/mm/yyyy format.");
      return false;
    }
    return true;
  };

  const validateBusinessDetails = () => {
    const phonePattern = /^(07|08|09)\d{9}$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!phonePattern.test(phone)) {
      toast.error("Phone must be 11 digits and start with 07, 08, or 09.");
      return false;
    }
    if (!passwordPattern.test(password)) {
      toast.error(
        "Password must be strong (8+ chars, 1 capital, 1 number, 1 special char)."
      );
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    if (!dependsOnDollarRate) {
      toast.error("Please select if your business depends on Dollar rate.");
      return false;
    }
    return true;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account 👤</h2>
      <form className="space-y-4">
        {step === 1 && (
          <StepOneEmail
            email={email}
            setEmail={setEmail}
            handleProceed={handleProceed}
            onSwitch={onSwitch}
          />
        )}
        {step === 2 && (
          <StepTwoOTP
            otp={otp}
            setOtp={setOtp}
            handleProceed={handleProceed}
            handleBack={handleBack}
          />
        )}
        {step === 3 && (
          <StepThreePersonal
            firstName={firstName}
            lastName={lastName}
            gender={gender}
            address={address}
            dob={dob}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setGender={setGender}
            setAddress={setAddress}
            setDob={setDob}
            handleProceed={handleProceed}
            handleBack={handleBack}
          />
        )}
        {step === 4 && (
          <StepFourBusiness
            businessType={businessType}
            customBusinessType={customBusinessType}
            dependsOnDollarRate={dependsOnDollarRate}
            phone={phone}
            password={password}
            confirmPassword={confirmPassword}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            setBusinessType={setBusinessType}
            setCustomBusinessType={setCustomBusinessType}
            setDependsOnDollarRate={setDependsOnDollarRate}
            setPhone={setPhone}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            handleProceed={handleProceed}
            handleBack={handleBack}
          />
        )}
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignupForm;
