import { PnlDashboard } from "@/components/pnl-dashboard";
import { ACCOUNTS, SAMPLE_TODAY } from "@/lib/sample-data";

export default function Home() {
  return <PnlDashboard accounts={ACCOUNTS} today={SAMPLE_TODAY} userInitial="C" />;
}
