import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PricingClient } from "@/components/payment/pricing-client";

export const metadata = { title: "Upgrade to Premium" };

export default async function DashboardPricingPage() {
  const session = await getServerSession(authOptions);
  return <PricingClient session={session} />;
}
