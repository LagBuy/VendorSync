import { Lock } from "lucide-react";
import SettingSection from "./SettingSection";
import ToggleSwitch from "./ToggleSwitch";
import { useState } from "react";
import Modal from "antd/es/modal/Modal";
import ChangePassword from "./ChangePassword";

const Security = () => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [password, setPassword] = useState(false);

  return (
    <SettingSection icon={Lock} title={"Security"}>
      <ToggleSwitch
        label={"Two-Factor Authentication"}
        isOn={twoFactor}
        onToggle={() => setTwoFactor(!twoFactor)}
      />
      <div className="mt-4">
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded
        transition duration-200
        "
          onClick={() => setPassword(true)}
        >
          Change Password
        </button>
        <Modal open={password} onCancel={() => setPassword(false)}>
          <ChangePassword />
        </Modal>
      </div>
    </SettingSection>
  );
};
export default Security;
