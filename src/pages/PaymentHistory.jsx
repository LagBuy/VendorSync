import OverviewCards from "../components/payment/OverviewCards";
import TransactionTable from "../components/payment/TransactionTable";
import PaymentSchedule from "../components/payment/PaymentSchedule";
import QuickStats from "../components/payment/QuickStats";
import ExportOptions from "../components/payment/ExportOptions";

import SubscriptionPlans from "../components/payment/SubscriptionPlans";
import CreditDebitChart from "../components/payment/CreditDebitChart";
import OfflineWithdrawal from "../components/payment/OfflineWithdrawal";
import TimeLockWithdrawal from "../components/payment/TimeLockWithdrawal";
import NigerianBusinessIdeasAndQuotes from "../components/payment/NigerianBusinessIdeasAndQuotes";

const PaymentHistory = () => {
  return (
    <div className="min-h-screen bg-gray-800 p-6 grid gap-6 grid-cols-1 lg:grid-cols-3 relative z-10 overflow-hidden">
      <div className="lg:col-span-2 space-y-6">
        <OverviewCards />
        <TransactionTable />
        <PaymentSchedule />
        <CreditDebitChart />
      </div>
      <div className="space-y-6">
        <QuickStats />
        <SubscriptionPlans />
        <OfflineWithdrawal />
        <TimeLockWithdrawal />
        <NigerianBusinessIdeasAndQuotes />
        <ExportOptions />
      </div>
    </div>
  );
};

export default PaymentHistory;
