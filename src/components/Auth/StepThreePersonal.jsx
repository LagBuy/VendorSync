import {
  FaUser,
  FaUsers,
  FaVenusMars,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const StepThreePersonal = ({
  firstName,
  lastName,
  gender,
  address,
  dob,
  setFirstName,
  setLastName,
  setGender,
  setAddress,
  setDob,
  handleProceed,
  handleBack,
}) => (
  <div className="space-y-6">
    {/* First Name Field */}
    <div className="space-y-2">
      <label
        className="block text-sm font-semibold pl-1"
        style={{ color: "rgba(17, 36, 29, 1)" }}
      >
        First Name
      </label>
      <div className="relative">
        <div
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
          style={{ color: "rgba(26, 54, 43, 0.6)" }}
        >
          <FaUser size={16} />
        </div>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 placeholder-opacity-60"
          style={{
            borderColor: "rgba(165, 244, 213, 1)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            color: "rgba(17, 36, 29, 1)",
            focusRingColor: "rgba(252, 230, 0, 0.3)",
          }}
          placeholder="Enter your first name"
        />
      </div>
    </div>

    {/* Last Name Field */}
    <div className="space-y-2">
      <label
        className="block text-sm font-semibold pl-1"
        style={{ color: "rgba(17, 36, 29, 1)" }}
      >
        Last Name
      </label>
      <div className="relative">
        <div
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
          style={{ color: "rgba(26, 54, 43, 0.6)" }}
        >
          <FaUsers size={16} />
        </div>
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 placeholder-opacity-60"
          style={{
            borderColor: "rgba(165, 244, 213, 1)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            color: "rgba(17, 36, 29, 1)",
            focusRingColor: "rgba(252, 230, 0, 0.3)",
          }}
          placeholder="Enter your last name"
        />
      </div>
    </div>

    {/* Gender Field */}
    <div className="space-y-2">
      <label
        className="block text-sm font-semibold pl-1"
        style={{ color: "rgba(17, 36, 29, 1)" }}
      >
        Gender
      </label>
      <div className="relative">
        <div
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
          style={{ color: "rgba(26, 54, 43, 0.6)" }}
        >
          <FaVenusMars size={16} />
        </div>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 appearance-none cursor-pointer"
          style={{
            borderColor: "rgba(165, 244, 213, 1)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            color: "rgba(17, 36, 29, 1)",
            focusRingColor: "rgba(252, 230, 0, 0.3)",
          }}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
        <div
          className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
          style={{ color: "rgba(26, 54, 43, 0.6)" }}
        >
          <span className="text-sm">▼</span>
        </div>
      </div>
    </div>

    {/* Address Field */}
    <div className="space-y-2">
      <label
        className="block text-sm font-semibold pl-1"
        style={{ color: "rgba(17, 36, 29, 1)" }}
      >
        Address
      </label>
      <div className="relative">
        <div
          className="absolute left-4 top-4 transform -translate-y-0"
          style={{ color: "rgba(26, 54, 43, 0.6)" }}
        >
          <FaMapMarkerAlt size={16} />
        </div>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 placeholder-opacity-60"
          style={{
            borderColor: "rgba(165, 244, 213, 1)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            color: "rgba(17, 36, 29, 1)",
            focusRingColor: "rgba(252, 230, 0, 0.3)",
          }}
          placeholder="Enter your address"
        />
      </div>
    </div>

    {/* Date of Birth Field */}
    <div className="space-y-2">
      <label
        className="block text-sm font-semibold pl-1"
        style={{ color: "rgba(17, 36, 29, 1)" }}
      >
        Date of Birth
      </label>
      <div className="relative">
        <div
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
          style={{ color: "rgba(26, 54, 43, 0.6)" }}
        >
          <FaCalendarAlt size={16} />
        </div>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200"
          style={{
            borderColor: "rgba(165, 244, 213, 1)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            color: "rgba(17, 36, 29, 1)",
            focusRingColor: "rgba(252, 230, 0, 0.3)",
          }}
        />
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex space-x-4 pt-4">
      <button
        onClick={handleBack}
        className="flex-1 py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3 group"
        style={{
          backgroundColor: "rgba(252, 230, 0, 0.1)",
          border: "2px solid rgba(252, 230, 0, 1)",
          color: "rgba(17, 36, 29, 1)",
        }}
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Back</span>
      </button>

      <button
        onClick={handleProceed}
        className="flex-1 py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3 group"
        style={{
          backgroundColor: "rgba(26, 54, 43, 1)",
          backgroundImage:
            "linear-gradient(135deg, rgba(26, 54, 43, 1) 0%, rgba(17, 36, 29, 1) 100%)",
        }}
      >
        <span>Proceed</span>
        <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
      </button>
    </div>
  </div>
);

export default StepThreePersonal;
