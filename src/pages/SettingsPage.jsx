// import Wallet from "../components/settings/Wallet";
import Header from "../components/common/Header";
import ConnectedAccounts from "../components/settings/ConnectedAccounts";
import DangerZone from "../components/settings/DangerZone";
import Notifications from "../components/settings/Notifications";
import Profile from "../components/settings/Profile";
import Security from "../components/settings/Security";
import SignOutNow from "../components/settings/SignOutNow";
import TermsModalTrigger from "../components/settings/TermsModalTrigger";

import VerifyPage from "../components/settings/VerifyPage";

const SettingsPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
      <Header title="Settings" />
      <main className="max-w-4xl mx-auto py-8 px-4 lg:px-8">
        <Profile />
        <Notifications />
        <Security />
        <ConnectedAccounts />
        <TermsModalTrigger />
        <VerifyPage />
        <SignOutNow />
        <DangerZone />
      </main>
    </div>
  );
};
export default SettingsPage;
