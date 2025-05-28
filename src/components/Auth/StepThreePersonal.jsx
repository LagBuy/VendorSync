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
  <>
    <div>
      <label className="block mb-1 text-sm font-medium">First Name</label>
      <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
      />
    </div>
    <div>
      <label className="block mb-1 text-sm font-medium">Last Name</label>
      <input
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
      />
    </div>
    <div>
      <label className="block mb-1 text-sm font-medium">Gender</label>
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </div>
    <div>
      <label className="block mb-1 text-sm font-medium">Address</label>
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
      />
    </div>
    <div>
      <label className="block mb-1 text-sm font-medium">Date of Birth</label>
      <input
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        placeholder="DD/MM/YYYY"
        className="w-full px-4 py-2 border rounded-md"
      />
    </div>
    <button
      onClick={handleBack}
      className="w-full bg-gray-600 text-white py-2 rounded-md"
    >
      Back
    </button>
    <button
      onClick={handleProceed}
      className="w-full bg-blue-600 text-white py-2 rounded-md"
    >
      Proceed
    </button>
  </>
);

export default StepThreePersonal;