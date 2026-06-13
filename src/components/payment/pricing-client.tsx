"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Smartphone, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency, PRICING_PLANS } from "@/lib/utils";
import { toast } from "sonner";

const PAYMENT_METHODS = [
  { id: "MTN_MOMO", label: "MTN Mobile Money", icon: "📱", color: "bg-yellow-50 border-yellow-300" },
  { id: "AIRTEL_MONEY", label: "Airtel Money", icon: "📱", color: "bg-red-50 border-red-300" },
  { id: "CARD", label: "Debit / Credit Card", icon: "💳", color: "bg-blue-50 border-blue-300" },
];

const PREMIUM_FEATURES = [
  "All premium notes (1,800+)",
  "All 3,600+ exam questions",
  "Mock exam mode (100Q / 3 hours)",
  "PDF note downloads",
  "Weekly leaderboard",
  "Offline study mode",
  "Priority support",
];

interface Props { session: any }

export function PricingClient({ session }: Props) {
  const [selectedPlan, setSelectedPlan] = useState(PRICING_PLANS[2]);
  const [method, setMethod] = useState("MTN_MOMO");
  const [phone, setPhone] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isMobileMoney = method === "MTN_MOMO" || method === "AIRTEL_MONEY";

  const handlePay = async () => {
    if (!session) { window.location.href = "/register"; return; }
    if (isMobileMoney && !phone) { toast.error("Enter your phone number"); return; }
    setLoading(true);
    const res = await fetch("/api/payment/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ months: selectedPlan.months, method, phone }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.link) {
      window.location.href = data.link;
    } else {
      toast.error("Payment initiation failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Crown className="h-4 w-4" /> Unlock Premium Access
          </div>
          <h1 className="font-sora text-4xl font-bold text-dark mb-3">Choose your plan</h1>
          <p className="text-muted text-lg">Pay in Uganda Shillings • Instant activation • Cancel anytime</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Plan selector */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="font-sora font-semibold text-dark mb-4">Select duration</h2>
            {PRICING_PLANS.map((plan, i) => (
              <motion.button
                key={plan.months}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelectedPlan(plan)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${selectedPlan.months === plan.months ? "border-primary-500 bg-primary-50" : "border-border hover:border-primary-300 bg-surface"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan.months === plan.months ? "border-primary-500 bg-primary-500" : "border-border"}`}>
                      {selectedPlan.months === plan.months && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div>
                      <div className="font-sora font-semibold text-dark">{plan.label}</div>
                      {plan.months >= 3 && (
                        <div className="text-xs text-accent-green font-medium">
                          Save {formatCurrency(plan.months * 25000 - plan.price)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-sora font-bold text-dark text-lg">{formatCurrency(plan.price)}</div>
                    <div className="text-xs text-muted">{formatCurrency(Math.round(plan.price / plan.months))}/mo</div>
                  </div>
                </div>
              </motion.button>
            ))}

            <div className="mt-6">
              <h2 className="font-sora font-semibold text-dark mb-4">Payment method</h2>
              <div className="grid grid-cols-1 gap-3">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${method === m.id ? `${m.color} border-current` : "border-border hover:border-primary-300"}`}
                  >
                    <span className="text-xl">{m.icon}</span>
                    <span className="font-medium text-dark text-sm">{m.label}</span>
                    {method === m.id && <Check className="h-4 w-4 text-primary-500 ml-auto" />}
                  </button>
                ))}
              </div>
            </div>

            {isMobileMoney && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <Label>Phone number</Label>
                <Input
                  className="mt-1"
                  placeholder={method === "MTN_MOMO" ? "0771234567" : "0751234567"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                />
                <p className="text-xs text-muted mt-1">You'll receive a USSD prompt to confirm payment</p>
              </motion.div>
            )}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 text-white sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="h-5 w-5 text-accent-gold" />
                <h3 className="font-sora font-bold text-lg">Premium Summary</h3>
              </div>
              <div className="mb-4">
                <div className="text-3xl font-sora font-bold">{formatCurrency(selectedPlan.price)}</div>
                <div className="text-primary-200 text-sm">{selectedPlan.label} of premium access</div>
              </div>
              <ul className="space-y-2 mb-6">
                {PREMIUM_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-3.5 w-3.5 text-accent-gold shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                onClick={handlePay}
                disabled={loading}
                className="w-full bg-white text-primary-600 hover:bg-primary-50 font-bold text-base"
                size="lg"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Crown className="h-5 w-5" />}
                {session ? `Pay ${formatCurrency(selectedPlan.price)}` : "Sign up to Pay"}
              </Button>
              <p className="text-primary-200 text-xs text-center mt-3">
                🔒 Secured by Flutterwave • Instant activation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
