import { User } from "lucide-react";
import { useRef, useState } from "react";
import SettingSection from "./SettingSection";

const Profile = () => {
  const [displayName, setDisplayName] = useState("zAHEEr");
  const [email] = useState("ujoshua976@gmail.com");
  const [editing, setEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(
    "https://randomuser.me/api/portraits/men/3.jpg"
  );
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfilePic(imageURL);
    }
  };

  const handleSave = () => {
    setEditing(false);
    // Optionally: Save to backend or localStorage here
  };

  return (
    <SettingSection icon={User} title={"Profile"}>
      <div className="flex flex-col sm:flex-row items-center mb-6">
        <div className="relative">
          <img
            src={profilePic}
            alt="Profile"
            className="rounded-full w-20 h-20 object-cover mr-4"
          />
          {editing && (
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-black bg-opacity-60 text-white text-xs rounded-full px-2 py-1"
            >
              Change
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </div>

        <div>
          {editing ? (
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-gray-700 text-white px-3 py-1 rounded mb-1"
            />
          ) : (
            <h3 className="text-lg font-semibold text-gray-100">
              {displayName}
            </h3>
          )}
          <p className="text-gray-400">{email}</p>
        </div>
      </div>

      {editing ? (
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
        >
          Edit profile
        </button>
      )}
    </SettingSection>
  );
};

export default Profile;
